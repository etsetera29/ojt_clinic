<?php
/**
 * First City Providential College - Clinic Management System
 * Records AJAX Handler
 */

require_once '../includes/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$action = $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'getRecords':
            getRecords($pdo);
            break;
        
        case 'getStatistics':
            getStatistics($pdo);
            break;
        
        case 'getPatientHistory':
            getPatientHistory($pdo);
            break;
        
        case 'getRecord':
            getRecord($pdo);
            break;
        
        case 'addRecord':
            addRecord($pdo);
            break;
        
        case 'updateRecord':
            updateRecord($pdo);
            break;
        
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function getRecords($pdo) {
    $year = $_POST['year'] ?? '';
    $patientType = $_POST['patientType'] ?? '';
    
    $sql = "SELECT * FROM appointment_records WHERE 1=1";
    $params = [];
    
    if (!empty($year)) {
        $sql .= " AND record_year = :year";
        $params[':year'] = $year;
    }
    
    if (!empty($patientType)) {
        $sql .= " AND patient_type = :patient_type";
        $params[':patient_type'] = $patientType;
    }
    
    $sql .= " ORDER BY appointment_date DESC, appointment_time DESC LIMIT 500";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $records = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'records' => $records]);
}

function getStatistics($pdo) {
    $statistics = [];
    
    // Gender distribution
    $stmt = $pdo->query("
        SELECT patient_gender, COUNT(*) as count
        FROM appointment_records
        WHERE patient_gender IS NOT NULL
        GROUP BY patient_gender
    ");
    $genderData = [];
    while ($row = $stmt->fetch()) {
        $genderData[$row['patient_gender']] = (int)$row['count'];
    }
    $statistics['gender'] = $genderData;
    
    // Education level distribution (for students)
    $stmt = $pdo->query("
        SELECT education_level, COUNT(*) as count
        FROM appointment_records
        WHERE patient_type = 'Student' AND education_level IS NOT NULL
        GROUP BY education_level
        ORDER BY count DESC
    ");
    $educationData = [];
    while ($row = $stmt->fetch()) {
        $educationData[$row['education_level']] = (int)$row['count'];
    }
    $statistics['education'] = $educationData;
    
    // Employee type distribution
    $stmt = $pdo->query("
        SELECT employee_type, COUNT(*) as count
        FROM appointment_records
        WHERE patient_type = 'Employee' AND employee_type IS NOT NULL
        GROUP BY employee_type
        ORDER BY count DESC
    ");
    $employeeData = [];
    while ($row = $stmt->fetch()) {
        $employeeData[$row['employee_type']] = (int)$row['count'];
    }
    $statistics['employee'] = $employeeData;
    
    // Course/Track distribution
    $stmt = $pdo->query("
        SELECT course_track, COUNT(*) as count
        FROM appointment_records
        WHERE course_track IS NOT NULL
        GROUP BY course_track
        ORDER BY count DESC
        LIMIT 10
    ");
    $courseData = [];
    while ($row = $stmt->fetch()) {
        $courseData[$row['course_track']] = (int)$row['count'];
    }
    $statistics['courses'] = $courseData;
    
    echo json_encode(['success' => true, 'statistics' => $statistics]);
}

function getPatientHistory($pdo) {
    $patientId = $_POST['patientId'] ?? 0;
    $patientType = $_POST['patientType'] ?? '';
    
    if (empty($patientId) || empty($patientType)) {
        echo json_encode(['success' => false, 'message' => 'Patient ID and type are required']);
        return;
    }
    
    // Get records from appointments table
    $sql = "SELECT 
                a.id,
                a.appointment_date,
                a.appointment_time,
                a.notes as reason,
                a.appointment_type,
                a.status
            FROM appointments a
            WHERE a.patient_id = :patient_id 
            AND a.patient_type = :patient_type 
            AND a.is_deleted = 0
            ORDER BY a.appointment_date DESC, a.appointment_time DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':patient_id' => $patientId,
        ':patient_type' => $patientType
    ]);
    
    $records = $stmt->fetchAll();
    echo json_encode(['success' => true, 'records' => $records]);
}

function getRecord($pdo) {
    $recordId = $_POST['recordId'] ?? 0;
    
    if (empty($recordId)) {
        echo json_encode(['success' => false, 'message' => 'Record ID is required']);
        return;
    }
    
    $sql = "SELECT 
                a.*,
                COALESCE(ar.bp, '') as bp,
                COALESCE(ar.rr, '') as rr,
                COALESCE(ar.temp, '') as temp,
                COALESCE(ar.weight, '') as weight,
                COALESCE(ar.hr, '') as hr,
                COALESCE(ar.o2sat, '') as o2sat,
                COALESCE(ar.height, '') as height,
                COALESCE(ar.bmi, '') as bmi,
                COALESCE(ar.prior_ssx, '') as prior_ssx,
                COALESCE(ar.present_ssx, '') as present_ssx,
                COALESCE(ar.intervention, '') as intervention,
                COALESCE(ar.reason, a.notes) as reason
            FROM appointments a
            LEFT JOIN appointment_vitals ar ON a.id = ar.appointment_id
            WHERE a.id = :id AND a.is_deleted = 0";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $recordId]);
    $record = $stmt->fetch();
    
    if ($record) {
        echo json_encode(['success' => true, 'record' => $record]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Record not found']);
    }
}

function addRecord($pdo) {
    try {
        $patientId = $_POST['patientId'] ?? 0;
        $patientType = $_POST['patientType'] ?? '';
        $recordDate = $_POST['recordDate'] ?? '';
        $recordTime = $_POST['recordTime'] ?? '';
        $reason = $_POST['reason'] ?? '';
        
        if (empty($patientId) || empty($patientType) || empty($recordDate) || empty($recordTime)) {
            echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
            return;
        }
        
        // Start transaction
        $pdo->beginTransaction();
        
        // Insert appointment
        $sql = "INSERT INTO appointments (
                    patient_type, patient_id, appointment_date, appointment_time,
                    appointment_type, status, notes
                ) VALUES (
                    :patient_type, :patient_id, :appointment_date, :appointment_time,
                    'Consultation', 'completed', :notes
                )";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':patient_type' => $patientType,
            ':patient_id' => $patientId,
            ':appointment_date' => $recordDate,
            ':appointment_time' => $recordTime,
            ':notes' => $reason
        ]);
        
        $appointmentId = $pdo->lastInsertId();
        
        // Insert vitals
        $vitalsSql = "INSERT INTO appointment_vitals (
                        appointment_id, bp, rr, temp, weight, hr, o2sat, height, bmi,
                        prior_ssx, present_ssx, intervention, reason
                    ) VALUES (
                        :appointment_id, :bp, :rr, :temp, :weight, :hr, :o2sat, :height, :bmi,
                        :prior_ssx, :present_ssx, :intervention, :reason
                    )";
        
        $vitalsStmt = $pdo->prepare($vitalsSql);
        $vitalsStmt->execute([
            ':appointment_id' => $appointmentId,
            ':bp' => $_POST['bp'] ?? null,
            ':rr' => $_POST['rr'] ?? null,
            ':temp' => $_POST['temp'] ?? null,
            ':weight' => $_POST['weight'] ?? null,
            ':hr' => $_POST['hr'] ?? null,
            ':o2sat' => $_POST['o2sat'] ?? null,
            ':height' => $_POST['height'] ?? null,
            ':bmi' => $_POST['bmi'] ?? null,
            ':prior_ssx' => $_POST['priorSsx'] ?? null,
            ':present_ssx' => $_POST['presentSsx'] ?? null,
            ':intervention' => $_POST['intervention'] ?? null,
            ':reason' => $reason
        ]);
        
        $pdo->commit();
        echo json_encode(['success' => true, 'id' => $appointmentId]);
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateRecord($pdo) {
    try {
        $recordId = $_POST['recordId'] ?? 0;
        $recordDate = $_POST['recordDate'] ?? '';
        $recordTime = $_POST['recordTime'] ?? '';
        $reason = $_POST['reason'] ?? '';
        
        if (empty($recordId) || empty($recordDate) || empty($recordTime)) {
            echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
            return;
        }
        
        // Start transaction
        $pdo->beginTransaction();
        
        // Update appointment
        $sql = "UPDATE appointments SET
                    appointment_date = :appointment_date,
                    appointment_time = :appointment_time,
                    notes = :notes
                WHERE id = :id AND is_deleted = 0";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $recordId,
            ':appointment_date' => $recordDate,
            ':appointment_time' => $recordTime,
            ':notes' => $reason
        ]);
        
        // Check if vitals record exists
        $checkSql = "SELECT id FROM appointment_vitals WHERE appointment_id = :appointment_id";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([':appointment_id' => $recordId]);
        $vitalsExists = $checkStmt->fetch();
        
        if ($vitalsExists) {
            // Update existing vitals
            $vitalsSql = "UPDATE appointment_vitals SET
                            bp = :bp, rr = :rr, temp = :temp, weight = :weight,
                            hr = :hr, o2sat = :o2sat, height = :height, bmi = :bmi,
                            prior_ssx = :prior_ssx, present_ssx = :present_ssx,
                            intervention = :intervention, reason = :reason
                        WHERE appointment_id = :appointment_id";
        } else {
            // Insert new vitals record
            $vitalsSql = "INSERT INTO appointment_vitals (
                            appointment_id, bp, rr, temp, weight, hr, o2sat, height, bmi,
                            prior_ssx, present_ssx, intervention, reason
                        ) VALUES (
                            :appointment_id, :bp, :rr, :temp, :weight, :hr, :o2sat, :height, :bmi,
                            :prior_ssx, :present_ssx, :intervention, :reason
                        )";
        }
        
        $vitalsStmt = $pdo->prepare($vitalsSql);
        $vitalsStmt->execute([
            ':appointment_id' => $recordId,
            ':bp' => $_POST['bp'] ?? null,
            ':rr' => $_POST['rr'] ?? null,
            ':temp' => $_POST['temp'] ?? null,
            ':weight' => $_POST['weight'] ?? null,
            ':hr' => $_POST['hr'] ?? null,
            ':o2sat' => $_POST['o2sat'] ?? null,
            ':height' => $_POST['height'] ?? null,
            ':bmi' => $_POST['bmi'] ?? null,
            ':prior_ssx' => $_POST['priorSsx'] ?? null,
            ':present_ssx' => $_POST['presentSsx'] ?? null,
            ':intervention' => $_POST['intervention'] ?? null,
            ':reason' => $reason
        ]);
        
        $pdo->commit();
        echo json_encode(['success' => true]);
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
