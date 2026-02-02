-- Migration: Add Appointment Vitals Table
-- This table stores detailed vital signs and medical information for each appointment

USE fcpc_clinic;

-- Create appointment_vitals table
CREATE TABLE IF NOT EXISTS appointment_vitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    
    -- Vital Signs
    bp VARCHAR(20) COMMENT 'Blood Pressure (e.g., 120/80)',
    rr VARCHAR(20) COMMENT 'Respiratory Rate',
    temp VARCHAR(20) COMMENT 'Temperature',
    weight VARCHAR(20) COMMENT 'Weight',
    hr VARCHAR(20) COMMENT 'Heart Rate',
    o2sat VARCHAR(20) COMMENT 'Oxygen Saturation',
    height VARCHAR(20) COMMENT 'Height',
    bmi VARCHAR(20) COMMENT 'Body Mass Index',
    
    -- Medical Information
    prior_ssx TEXT COMMENT 'Prior signs/symptoms',
    present_ssx TEXT COMMENT 'Present signs/symptoms',
    intervention TEXT COMMENT 'Treatment/intervention provided',
    reason TEXT COMMENT 'Reason for clinic visit',
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_appointment_id (appointment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
