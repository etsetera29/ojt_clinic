/**
 * First City Providential College - Clinic Management System
 * Main Application JavaScript - Updated Version
 */

// Global variables
let deleteType = null;
let deleteId = null;
let currentSection = 'dashboard';
let charts = {}; // Store chart instances

// ==========================================
// PHILIPPINE EDUCATION SYSTEM DATA
// ==========================================
// This object contains all courses, tracks, and strands based on DepEd/CHED
// TO ADD MORE COURSES/TRACKS/STRANDS:
// 1. Find the appropriate education level below
// 2. Add your course/track to the 'courses' array
// 3. Keep alphabetical order for easy management
// 4. Use official DepEd/CHED naming conventions
// ==========================================

const educationData = {
    Elementary: {
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        courses: ['General Education']
    },
    
    'Junior High': {
        grades: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
        courses: ['General Education']
    },
    
    // ==========================================
    // SENIOR HIGH SCHOOL TRACKS/STRANDS
    // Based on DepEd K-12 Program
    // ==========================================
    'Senior High': {
        grades: ['Grade 11', 'Grade 12'],
        courses: [
            // Academic Track - STEM
            'STEM (Science, Technology, Engineering, Mathematics)',
            
            // Academic Track - ABM
            'ABM (Accountancy, Business, Management)',
            
            // Academic Track - HUMSS
            'HUMSS (Humanities and Social Sciences)',
            
            // Academic Track - GAS
            'GAS (General Academic Strand)',
            
            // TVL Track - ICT
            'TVL-ICT (Information and Communications Technology)',
            
            // TVL Track - Home Economics
            'TVL-HE (Home Economics)',
            'TVL-HE - Bread and Pastry Production',
            'TVL-HE - Cookery',
            'TVL-HE - Food and Beverage Services',
            'TVL-HE - Housekeeping',
            
            // TVL Track - Industrial Arts
            'TVL-IA (Industrial Arts)',
            'TVL-IA - Automotive Servicing',
            'TVL-IA - Carpentry',
            'TVL-IA - Construction',
            'TVL-IA - Electrical Installation and Maintenance',
            'TVL-IA - Electronics',
            'TVL-IA - Plumbing',
            'TVL-IA - Welding',
            
            // TVL Track - Agri-Fishery Arts
            'TVL-AFA (Agri-Fishery Arts)',
            'TVL-AFA - Agricultural Crops Production',
            'TVL-AFA - Animal Production',
            'TVL-AFA - Aquaculture',
            'TVL-AFA - Horticulture',
            'TVL-AFA - Landscape Installation',
            'TVL-AFA - Organic Agriculture',
            'TVL-AFA - Pest Management',
            
            // Arts and Design Track
            'Arts and Design',
            'Arts and Design - Media Arts',
            'Arts and Design - Visual Arts',
            
            // Sports Track
            'Sports Track'
        ]
    },
    
    // ==========================================
    // COLLEGE/UNIVERSITY COURSES
    // Based on CHED Programs
    // ==========================================
    College: {
        grades: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'],
        courses: [
            // ========== BUSINESS AND MANAGEMENT ==========
            'BS Accountancy (BSA)',
            'BS Business Administration (BSBA)',
            'BS Business Administration - Financial Management',
            'BS Business Administration - Human Resource Management',
            'BS Business Administration - Marketing Management',
            'BS Business Administration - Operations Management',
            'BS Entrepreneurship (BSE)',
            'BS Office Administration (BSOA)',
            'BS Real Estate Management (BSREM)',
            
            // ========== COMPUTER STUDIES ==========
            'BS Computer Science (BSCS)',
            'BS Information Systems (BSIS)',
            'BS Information Technology (BSIT)',
            
            // ========== EDUCATION ==========
            'Bachelor of Elementary Education (BEEd)',
            'Bachelor of Early Childhood Education (BECEd)',
            'Bachelor of Physical Education (BPEd)',
            'Bachelor of Special Needs Education (BSNEd)',
            'Bachelor of Technology and Livelihood Education (BTLEd)',
            'BS Education (BSEd)',
            'BS Secondary Education - English (BSEd-English)',
            'BS Secondary Education - Filipino (BSEd-Filipino)',
            'BS Secondary Education - Mathematics (BSEd-Math)',
            'BS Secondary Education - Science (BSEd-Science)',
            'BS Secondary Education - Social Studies (BSEd-SocSci)',
            
            // ========== ENGINEERING ==========
            'BS Architecture (BSArch)',
            'BS Civil Engineering (BSCE)',
            'BS Computer Engineering (BSCpE)',
            'BS Electrical Engineering (BSEE)',
            'BS Electronics Engineering (BSECE)',
            'BS Industrial Engineering (BSIE)',
            'BS Mechanical Engineering (BSME)',
            
            // ========== HEALTH SCIENCES ==========
            'BS Medical Technology (BSMT)',
            'BS Midwifery (BSM)',
            'BS Nursing (BSN)',
            'BS Nutrition and Dietetics (BSND)',
            'BS Pharmacy (BSP)',
            'BS Physical Therapy (BSPT)',
            'BS Public Health (BSPH)',
            'BS Radiologic Technology (BSRT)',
            'BS Respiratory Therapy (BSRT)',
            'Doctor of Medicine (MD)',
            
            // ========== HOSPITALITY AND TOURISM ==========
            'BS Hotel and Restaurant Management (BSHRM)',
            'BS Hospitality Management (BSHM)',
            'BS Tourism Management (BSTM)',
            
            // ========== LIBERAL ARTS ==========
            'AB Communication (ABComm)',
            'AB English Language',
            'AB Filipino',
            'AB History',
            'AB Journalism',
            'AB Literature',
            'AB Philosophy',
            'AB Political Science (AB PolSci)',
            'AB Psychology (AB Psych)',
            'AB Sociology',
            'BS Psychology (BS Psych)',
            
            // ========== SCIENCES ==========
            'BS Agriculture (BSA)',
            'BS Applied Mathematics (BSAM)',
            'BS Biology (BSBio)',
            'BS Chemistry (BSChem)',
            'BS Environmental Science (BSES)',
            'BS Fisheries (BSF)',
            'BS Forestry (BSFor)',
            'BS Marine Biology (BSMB)',
            'BS Mathematics (BSMath)',
            'BS Physics (BSPhy)',
            
            // ========== CRIMINOLOGY ==========
            'BS Criminology (BSCrim)',
            
            // ========== SOCIAL WORK ==========
            'BS Social Work (BSSW)',
            
            // ========== MULTIMEDIA ARTS ==========
            'BS Entertainment and Multimedia Computing (BSEMC)',
            'BA Multimedia Arts (BAMMA)',
            
            // ========== OTHERS ==========
            'BS Customs Administration (BSCA)',
            'BS Development Communication (BSDC)',
            'BS Library and Information Science (BSLIS)',
            'BS Marine Transportation (BSMT)',
            'BS Maritime Engineering (BSMarE)'
        ]
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadPatientOptions();
    loadYearOptions();
    loadTodayAppointments();
    loadTomorrowAppointments();
    loadPatients();
    loadAppointments();
    loadRecords();
    
    // Setup form submissions
    setupFormHandlers();
    
    // Setup delete confirmation input
    setupDeleteConfirmation();
    
    // Auto-refresh dashboard every 30 seconds
    setInterval(() => {
        if (currentSection === 'dashboard') {
            loadTodayAppointments();
            loadTomorrowAppointments();
        }
    }, 30000);
});

function initializeApp() {
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('mobile-open');
        });
    }
    
    // Setup patient type filter change handler
    const patientTypeFilter = document.getElementById('patientTypeFilter');
    if (patientTypeFilter) {
        patientTypeFilter.addEventListener('change', function() {
            const educationFilter = document.getElementById('patientEducationFilter');
            const employeeFilter = document.getElementById('patientEmployeeFilter');
            const deptTrackFilter = document.getElementById('patientDeptTrackFilter');
            
            if (this.value === 'Student') {
                educationFilter.style.display = 'block';
                employeeFilter.style.display = 'none';
                deptTrackFilter.style.display = 'block';
                populateStudentDeptTrackFilter();
            } else if (this.value === 'Employee') {
                educationFilter.style.display = 'none';
                employeeFilter.style.display = 'block';
                deptTrackFilter.style.display = 'block';
                populateEmployeeDeptTrackFilter();
            } else {
                educationFilter.style.display = 'none';
                employeeFilter.style.display = 'none';
                deptTrackFilter.style.display = 'none';
            }
        });
    }
    
    // Setup education level filter to update dept/track options
    const educationFilter = document.getElementById('patientEducationFilter');
    if (educationFilter) {
        educationFilter.addEventListener('change', function() {
            populateStudentDeptTrackFilter();
        });
    }
}

// Populate department/track filter for students based on education level
function populateStudentDeptTrackFilter() {
    const educationLevel = document.getElementById('patientEducationFilter')?.value;
    const deptTrackFilter = document.getElementById('patientDeptTrackFilter');
    
    if (!deptTrackFilter) return;
    
    deptTrackFilter.innerHTML = '<option value="">All Courses/Tracks</option>';
    
    if (educationLevel && educationData[educationLevel]) {
        educationData[educationLevel].courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            deptTrackFilter.appendChild(option);
        });
    } else {
        // Show all student courses if no education level selected
        Object.keys(educationData).forEach(level => {
            educationData[level].courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = `${level} - ${course}`;
                deptTrackFilter.appendChild(option);
            });
        });
    }
}

// Populate department filter for employees
function populateEmployeeDeptTrackFilter() {
    const deptTrackFilter = document.getElementById('patientDeptTrackFilter');
    
    if (!deptTrackFilter) return;
    
    // Get departments from the employee form dropdown
    const departmentSelect = document.getElementById('department');
    if (!departmentSelect) return;
    
    deptTrackFilter.innerHTML = '<option value="">All Departments</option>';
    
    // Copy options from employee department dropdown
    const optgroups = departmentSelect.querySelectorAll('optgroup');
    optgroups.forEach(optgroup => {
        const newOptgroup = document.createElement('optgroup');
        newOptgroup.label = optgroup.label;
        
        const options = optgroup.querySelectorAll('option');
        options.forEach(opt => {
            if (opt.value) {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.textContent;
                newOptgroup.appendChild(option);
            }
        });
        
        deptTrackFilter.appendChild(newOptgroup);
    });
}

// ========================================
// NAVIGATION
// ========================================
function navigateTo(section) {
    // Update active section
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    currentSection = section;
    
    // Load data for specific sections
    if (section === 'dashboard') {
        loadTodayAppointments();
        loadTomorrowAppointments();
    } else if (section === 'patients') {
        loadPatients();
    } else if (section === 'appointments') {
        loadAppointments();
    } else if (section === 'records') {
        loadRecords();
        loadStatistics();
    }
}

// ========================================
// DASHBOARD - TODAY'S & TOMORROW'S APPOINTMENTS
// ========================================
function loadTodayAppointments() {
    const formData = new FormData();
    formData.append('action', 'getTodayAppointments');
    
    const statusFilter = document.getElementById('dashboardStatusFilter')?.value || '';
    const sortBy = document.getElementById('dashboardSortBy')?.value || 'time-asc';
    
    if (statusFilter) formData.append('status', statusFilter);
    formData.append('sortBy', sortBy);
    
    fetch('ajax/appointments.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderTodayAppointments(data.appointments);
            updateDashboardStats(data.stats);
        }
    })
    .catch(error => console.error('Error:', error));
}

function loadTomorrowAppointments() {
    const formData = new FormData();
    formData.append('action', 'getTomorrowAppointments');
    
    const sortBy = document.getElementById('tomorrowSortBy')?.value || 'time-asc';
    formData.append('sortBy', sortBy);
    
    fetch('ajax/appointments.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderTomorrowAppointments(data.appointments);
        }
    })
    .catch(error => console.error('Error:', error));
}

function renderTodayAppointments(appointments) {
    const tbody = document.getElementById('todayAppointmentsList');
    
    if (!appointments || appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No appointments scheduled for today</td></tr>';
        return;
    }
    
    tbody.innerHTML = appointments.map(apt => `
        <tr>
            <td>${formatTime(apt.appointment_time)}</td>
            <td>${apt.patient_name}</td>
            <td>${apt.appointment_type}</td>
            <td><span class="badge badge-${apt.status}">${capitalizeFirst(apt.status)}</span></td>
            <td>
                <div class="action-buttons">
                    ${apt.status !== 'checked-in' && apt.status !== 'completed' ? `
                        <button class="btn btn-sm btn-primary" onclick="checkInAppointment(${apt.id})">
                            Check In
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-secondary" onclick="editAppointment(${apt.id})">
                        Edit
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderTomorrowAppointments(appointments) {
    const tbody = document.getElementById('tomorrowAppointmentsList');
    
    if (!appointments || appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No appointments scheduled for tomorrow</td></tr>';
        return;
    }
    
    tbody.innerHTML = appointments.map(apt => `
        <tr>
            <td>${formatTime(apt.appointment_time)}</td>
            <td>${apt.patient_name}</td>
            <td>${apt.appointment_type}</td>
            <td><span class="badge badge-${apt.status}">${capitalizeFirst(apt.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="editAppointment(${apt.id})">
                        Edit
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateDashboardStats(stats) {
    if (stats) {
        document.getElementById('todayAppointmentsCount').textContent = stats.today || 0;
        document.getElementById('checkedInCount').textContent = stats.checkedIn || 0;
    }
}

function filterDashboardAppointments() {
    loadTodayAppointments();
}

function filterTomorrowAppointments() {
    loadTomorrowAppointments();
}

function checkInAppointment(id) {
    const formData = new FormData();
    formData.append('action', 'checkIn');
    formData.append('id', id);
    
    fetch('ajax/appointments.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Patient checked in successfully!', 'success');
            loadTodayAppointments();
            loadTomorrowAppointments();
        } else {
            showAlert(data.message || 'Error checking in patient', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Error checking in patient', 'danger');
    });
}

// ========================================
// PATIENTS
// ========================================
function loadPatients() {
    const typeFilter = document.getElementById('patientTypeFilter')?.value || '';
    const educationFilter = document.getElementById('patientEducationFilter')?.value || '';
    const employeeFilter = document.getElementById('patientEmployeeFilter')?.value || '';
    const deptTrackFilter = document.getElementById('patientDeptTrackFilter')?.value || '';
    const searchQuery = document.getElementById('patientSearch')?.value || '';
    
    const formData = new FormData();
    formData.append('action', 'getPatients');
    formData.append('type', typeFilter);
    formData.append('educationLevel', educationFilter);
    formData.append('employeeType', employeeFilter);
    formData.append('deptTrack', deptTrackFilter);
    formData.append('search', searchQuery);
    
    fetch('ajax/patients.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderPatients(data.patients);
        }
    })
    .catch(error => console.error('Error:', error));
}

function renderPatients(patients) {
    const tbody = document.getElementById('patientsList');
    
    if (!patients || patients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No patients found</td></tr>';
        return;
    }
    
    tbody.innerHTML = patients.map(patient => {
        let levelInfo = '';
        if (patient.patient_type === 'Student') {
            levelInfo = `${patient.education_level || 'N/A'} - ${patient.grade_level || 'N/A'}`;
        } else {
            levelInfo = `${patient.employee_type || 'N/A'} - ${patient.department || 'N/A'}`;
        }
        
        const fullName = `${patient.first_name} ${patient.last_name}`;
        
        return `
        <tr>
            <td><span class="badge badge-${patient.patient_type.toLowerCase()}">${patient.patient_type}</span></td>
            <td colspan="2">
                <a href="#" class="patient-name-link" onclick="openPatientDetails(${patient.id}, '${patient.patient_type}'); return false;">
                    ${fullName}
                </a>
            </td>
            <td>${patient.age || 'N/A'}</td>
            <td>${patient.phone || 'N/A'}</td>
            <td>${levelInfo}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="editPatient(${patient.id}, '${patient.patient_type}')">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDeletePatient(${patient.id}, '${fullName.replace(/'/g, "\\'")}', '${patient.patient_type}')">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

function filterPatients() {
    loadPatients();
}

function openAddPatientModal() {
    document.getElementById('patientModalTitle').textContent = 'Add New Patient';
    document.getElementById('patientForm').reset();
    document.getElementById('patientId').value = '';
    document.getElementById('patientModal').classList.add('active');
}

function closePatientModal() {
    document.getElementById('patientModal').classList.remove('active');
}

function togglePatientFields() {
    const patientType = document.getElementById('patientType').value;
    const studentFields = document.getElementById('studentFields');
    const employeeFields = document.getElementById('employeeFields');
    
    if (patientType === 'Student') {
        studentFields.style.display = 'block';
        employeeFields.style.display = 'none';
        
        // Set student fields as required
        document.getElementById('studentId').required = true;
        document.getElementById('educationLevel').required = true;
        document.getElementById('gradeLevel').required = true;
        document.getElementById('courseTrack').required = true;
        
        // Remove employee required fields
        document.getElementById('employeeId').required = false;
        document.getElementById('employeeType').required = false;
        document.getElementById('department').required = false;
        
    } else if (patientType === 'Employee') {
        studentFields.style.display = 'none';
        employeeFields.style.display = 'block';
        
        // Remove student required fields
        document.getElementById('studentId').required = false;
        document.getElementById('educationLevel').required = false;
        document.getElementById('gradeLevel').required = false;
        document.getElementById('courseTrack').required = false;
        
        // Set employee fields as required
        document.getElementById('employeeId').required = true;
        document.getElementById('employeeType').required = true;
        document.getElementById('department').required = true;
        
    } else {
        studentFields.style.display = 'none';
        employeeFields.style.display = 'none';
        
        // Remove all required fields
        document.getElementById('studentId').required = false;
        document.getElementById('educationLevel').required = false;
        document.getElementById('gradeLevel').required = false;
        document.getElementById('courseTrack').required = false;
        document.getElementById('employeeId').required = false;
        document.getElementById('employeeType').required = false;
        document.getElementById('department').required = false;
    }
}

function updateGradeLevelOptions() {
    const educationLevel = document.getElementById('educationLevel').value;
    const gradeLevelSelect = document.getElementById('gradeLevel');
    const courseTrackSelect = document.getElementById('courseTrack');
    
    if (!educationLevel) {
        gradeLevelSelect.innerHTML = '<option value="">Select Grade/Year</option>';
        courseTrackSelect.innerHTML = '<option value="">Select Course/Track</option>';
        return;
    }
    
    const data = educationData[educationLevel];
    
    // Update grade levels
    gradeLevelSelect.innerHTML = '<option value="">Select Grade/Year</option>' +
        data.grades.map(grade => `<option value="${grade}">${grade}</option>`).join('');
    
    // Update courses/tracks
    courseTrackSelect.innerHTML = '<option value="">Select Course/Track</option>' +
        data.courses.map(course => `<option value="${course}">${course}</option>`).join('');
    
    // Make fields required
    gradeLevelSelect.required = true;
    courseTrackSelect.required = true;
}

function editPatient(id, type) {
    const formData = new FormData();
    formData.append('action', 'getPatient');
    formData.append('id', id);
    formData.append('type', type);
    
    fetch('ajax/patients.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const patient = data.patient;
            document.getElementById('patientModalTitle').textContent = 'Edit Patient';
            document.getElementById('patientId').value = patient.id;
            document.getElementById('patientType').value = patient.patient_type;
            document.getElementById('firstName').value = patient.first_name;
            document.getElementById('lastName').value = patient.last_name;
            document.getElementById('patientAge').value = patient.age;
            document.getElementById('patientGender').value = patient.gender;
            document.getElementById('patientPhone').value = patient.phone || '';
            document.getElementById('patientEmail').value = patient.email || '';
            document.getElementById('patientAddress').value = patient.address || '';
            
            togglePatientFields();
            
            if (patient.patient_type === 'Student') {
                document.getElementById('studentId').value = patient.student_id || '';
                document.getElementById('educationLevel').value = patient.education_level || '';
                updateGradeLevelOptions();
                setTimeout(() => {
                    document.getElementById('gradeLevel').value = patient.grade_level || '';
                    document.getElementById('courseTrack').value = patient.course_track || '';
                }, 100);
            } else if (patient.patient_type === 'Employee') {
                document.getElementById('employeeId').value = patient.employee_id || '';
                document.getElementById('employeeType').value = patient.employee_type || '';
                document.getElementById('department').value = patient.department || '';
            }
            
            document.getElementById('patientModal').classList.add('active');
        }
    })
    .catch(error => console.error('Error:', error));
}

function confirmDeletePatient(id, name, type) {
    deleteType = 'patient';
    deleteId = id;
    window.deletePatientType = type; // Store patient type globally
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete patient "${name}"? This action cannot be undone.`;
    document.getElementById('deleteModal').classList.add('active');
}

// ========================================
// APPOINTMENTS
// ========================================
function loadAppointments() {
    const yearFilter = document.getElementById('appointmentYearFilter')?.value || '';
    const typeFilter = document.getElementById('appointmentTypeFilter')?.value || '';
    const statusFilter = document.getElementById('appointmentStatusFilter')?.value || '';
    
    const formData = new FormData();
    formData.append('action', 'getAppointments');
    formData.append('year', yearFilter);
    formData.append('patientType', typeFilter);
    formData.append('status', statusFilter);
    
    fetch('ajax/appointments.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderAppointments(data.appointments);
        }
    })
    .catch(error => console.error('Error:', error));
}

function renderAppointments(appointments) {
    const container = document.getElementById('appointmentsList');
    
    if (!appointments || appointments.length === 0) {
        container.innerHTML = '<p class="text-center">No appointments found</p>';
        return;
    }
    
    container.innerHTML = appointments.map(apt => `
        <div class="appointment-item">
            <div class="appointment-info">
                <h3>${apt.patient_name}</h3>
                <p>
                    <strong>${formatDate(apt.appointment_date)}</strong> at <strong>${formatTime(apt.appointment_time)}</strong>
                    <br>Type: ${apt.appointment_type}
                    ${apt.notes ? `<br>Notes: ${apt.notes}` : ''}
                </p>
            </div>
            <div>
                <span class="badge badge-${apt.status}">${capitalizeFirst(apt.status)}</span>
            </div>
            <div class="action-buttons">
                <button class="btn btn-sm btn-secondary" onclick="editAppointment(${apt.id})">
                    Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteAppointment(${apt.id}, '${apt.patient_name}')">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function filterAppointments() {
    loadAppointments();
}

function openAddAppointmentModal() {
    document.getElementById('appointmentModalTitle').textContent = 'Add New Appointment';
    document.getElementById('appointmentForm').reset();
    document.getElementById('appointmentId').value = '';
    document.getElementById('appointmentModal').classList.add('active');
    loadPatientOptions();
}

function closeAppointmentModal() {
    document.getElementById('appointmentModal').classList.remove('active');
}

function editAppointment(id) {
    const formData = new FormData();
    formData.append('action', 'getAppointment');
    formData.append('id', id);
    
    fetch('ajax/appointments.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const apt = data.appointment;
            document.getElementById('appointmentModalTitle').textContent = 'Edit Appointment';
            document.getElementById('appointmentId').value = apt.id;
            document.getElementById('appointmentPatient').value = apt.patient_id;
            document.getElementById('appointmentPatientType').value = apt.patient_type;
            document.getElementById('appointmentDate').value = apt.appointment_date;
            document.getElementById('appointmentTime').value = apt.appointment_time;
            document.getElementById('appointmentType').value = apt.appointment_type;
            document.getElementById('appointmentStatus').value = apt.status;
            document.getElementById('appointmentNotes').value = apt.notes || '';
            
            document.getElementById('appointmentModal').classList.add('active');
        }
    })
    .catch(error => console.error('Error:', error));
}

function confirmDeleteAppointment(id, patientName) {
    deleteType = 'appointment';
    deleteId = id;
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete the appointment for "${patientName}"? This action cannot be undone.`;
    document.getElementById('deleteModal').classList.add('active');
}

// ========================================
// RECORDS & STATISTICS
// ========================================
function switchRecordsTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.tab-btn').classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    if (tabId === 'statistics-tab') {
        loadStatistics();
    }
}

function archiveCompletedAppointments() {
    if (!confirm('This will archive all completed appointments to the records table. Continue?')) {
        return;
    }
    
    showAlert('Archiving completed appointments...', 'info');
    
    const formData = new FormData();
    formData.append('action', 'archiveCompleted');
    
    fetch('ajax/archive.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert(`Successfully archived ${data.archived} appointments!`, 'success');
            loadRecords();
            loadStatistics();
        } else {
            showAlert(data.message || 'Error archiving appointments', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Error archiving appointments', 'danger');
    });
}

function loadRecords() {
    const yearFilter = document.getElementById('recordsYearFilter')?.value || '';
    const typeFilter = document.getElementById('recordsTypeFilter')?.value || '';
    
    const formData = new FormData();
    formData.append('action', 'getRecords');
    formData.append('year', yearFilter);
    formData.append('patientType', typeFilter);
    
    fetch('ajax/records.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderRecords(data.records);
        }
    })
    .catch(error => console.error('Error:', error));
}

function renderRecords(records) {
    const tbody = document.getElementById('recordsList');
    
    if (!records || records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No records found</td></tr>';
        return;
    }
    
    tbody.innerHTML = records.map(record => {
        let levelInfo = '';
        if (record.patient_type === 'Student') {
            levelInfo = `${record.education_level || 'N/A'} - ${record.grade_level || 'N/A'}`;
        } else {
            levelInfo = record.employee_type || 'N/A';
        }
        
        return `
        <tr>
            <td>${formatDate(record.appointment_date)}</td>
            <td>${record.patient_name}</td>
            <td><span class="badge badge-${record.patient_type.toLowerCase()}">${record.patient_type}</span></td>
            <td>${levelInfo}</td>
            <td>${record.appointment_type}</td>
            <td><span class="badge badge-${record.status}">${capitalizeFirst(record.status)}</span></td>
            <td>${record.notes || 'N/A'}</td>
        </tr>
        `;
    }).join('');
}

function filterRecords() {
    loadRecords();
}

function loadStatistics() {
    const formData = new FormData();
    formData.append('action', 'getStatistics');
    
    fetch('ajax/records.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderStatistics(data.statistics);
        }
    })
    .catch(error => console.error('Error:', error));
}

function renderStatistics(stats) {
    // Gender Distribution Chart
    if (stats.gender) {
        createPieChart('genderChart', 'Gender Distribution', stats.gender, 'genderStats');
    }
    
    // Education Level Chart
    if (stats.education) {
        createBarChart('educationChart', 'Appointments by Education Level', stats.education, 'educationStats');
    }
    
    // Employee Type Chart
    if (stats.employee) {
        createPieChart('employeeChart', 'Employee Appointments', stats.employee, 'employeeStats');
    }
    
    // Course/Track Chart
    if (stats.courses) {
        createBarChart('courseChart', 'Top Courses/Tracks', stats.courses, 'courseStats');
    }
}

function createPieChart(canvasId, title, data, statsId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if exists
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    const labels = Object.keys(data);
    const values = Object.values(data);
    const total = values.reduce((a, b) => a + b, 0);
    
    charts[canvasId] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
    
    // Display summary
    const statsContainer = document.getElementById(statsId);
    if (statsContainer) {
        statsContainer.innerHTML = `
            <p><strong>Total: ${total}</strong></p>
            ${labels.map((label, i) => `
                <p>${label}: ${values[i]} (${((values[i]/total)*100).toFixed(1)}%)</p>
            `).join('')}
        `;
    }
}

function createBarChart(canvasId, title, data, statsId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if exists
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    // Sort and take top 10
    const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const labels = sorted.map(item => item[0]);
    const values = sorted.map(item => item[1]);
    const total = values.reduce((a, b) => a + b, 0);
    
    charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Appointments',
                data: values,
                backgroundColor: '#d4af37'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Display summary
    const statsContainer = document.getElementById(statsId);
    if (statsContainer) {
        statsContainer.innerHTML = `
            <p><strong>Total: ${total}</strong></p>
            ${labels.slice(0, 5).map((label, i) => `
                <p>${i+1}. ${label}: ${values[i]}</p>
            `).join('')}
        `;
    }
}

// ========================================
// NOTIFICATIONS
// ========================================
function showNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.add('active');
    loadNotifications();
}

function closeNotifications() {
    document.getElementById('notificationPanel').classList.remove('active');
}

function loadNotifications() {
    const formData = new FormData();
    formData.append('action', 'getNotifications');
    
    fetch('ajax/appointments.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderNotifications(data.notifications);
        }
    })
    .catch(error => console.error('Error:', error));
}

function renderNotifications(notifications) {
    const container = document.getElementById('notificationList');
    
    if (!notifications || notifications.length === 0) {
        container.innerHTML = '<p class="text-center">No pending notifications</p>';
        return;
    }
    
    container.innerHTML = notifications.map(notif => `
        <div class="notification-item" onclick="goToAppointment(${notif.id})" style="cursor: pointer;">
            <h4>${notif.patient_name}</h4>
            <p>
                Appointment on ${formatDate(notif.appointment_date)} at ${formatTime(notif.appointment_time)}
                <br>Status: <span class="badge badge-${notif.status}">${capitalizeFirst(notif.status)}</span>
            </p>
        </div>
    `).join('');
}

function goToAppointment(appointmentId) {
    closeNotifications();
    navigateTo('appointments');
    // Optional: highlight the appointment
    setTimeout(() => {
        const appointmentItems = document.querySelectorAll('.appointment-item');
        appointmentItems.forEach(item => {
            if (item.innerHTML.includes(`onclick="editAppointment(${appointmentId})`)) {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                item.style.backgroundColor = '#fef3c7';
                setTimeout(() => {
                    item.style.backgroundColor = '';
                }, 2000);
            }
        });
    }, 300);
}

// ========================================
// FORM SUBMISSIONS
// ========================================
function setupFormHandlers() {
    // Patient Form
    document.getElementById('patientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePatient();
    });
    
    // Appointment Form
    document.getElementById('appointmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAppointment();
    });
    
    // Import Form
    document.getElementById('importForm').addEventListener('submit', function(e) {
        e.preventDefault();
        importData();
    });
    
    // Export Form
    document.getElementById('exportForm').addEventListener('submit', function(e) {
        e.preventDefault();
        exportData();
    });
}

function savePatient() {
    const formData = new FormData(document.getElementById('patientForm'));
    formData.append('action', document.getElementById('patientId').value ? 'updatePatient' : 'addPatient');
    
    // Debug: Log what we're sending
    console.log('Saving patient with data:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    fetch('ajax/patients.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
        if (data.success) {
            showAlert('Patient saved successfully!', 'success');
            closePatientModal();
            loadPatients();
            loadPatientOptions();
        } else {
            showAlert(data.message || 'Error saving patient', 'danger');
            console.error('Save failed:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Error saving patient: ' + error.message, 'danger');
    });
}

function saveAppointment() {
    const formData = new FormData(document.getElementById('appointmentForm'));
    formData.append('action', document.getElementById('appointmentId').value ? 'updateAppointment' : 'addAppointment');
    
    fetch('ajax/appointments.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Appointment saved successfully!', 'success');
            closeAppointmentModal();
            loadAppointments();
            loadTodayAppointments();
            loadTomorrowAppointments();
        } else {
            showAlert(data.message || 'Error saving appointment', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Error saving appointment', 'danger');
    });
}

// ========================================
// DELETE CONFIRMATION
// ========================================
function setupDeleteConfirmation() {
    const confirmInput = document.getElementById('deleteConfirmText');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const errorMsg = document.getElementById('deleteConfirmError');
    
    confirmInput.addEventListener('input', function() {
        const value = this.value.trim();
        const correctText = 'First City Providential College';
        
        if (value === correctText) {
            confirmBtn.disabled = false;
            errorMsg.style.display = 'none';
        } else {
            confirmBtn.disabled = true;
            if (value.length > 0) {
                errorMsg.style.display = 'block';
            } else {
                errorMsg.style.display = 'none';
            }
        }
    });
}

function confirmDelete() {
    if (!deleteType || !deleteId) return;
    
    const formData = new FormData();
    formData.append('action', 'delete' + capitalizeFirst(deleteType));
    formData.append('id', deleteId);
    
    if (deleteType === 'patient' && window.deletePatientType) {
        formData.append('type', window.deletePatientType);
    }
    
    const endpoint = deleteType === 'patient' ? 'ajax/patients.php' : 'ajax/appointments.php';
    
    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert(capitalizeFirst(deleteType) + ' deleted successfully!', 'success');
            closeDeleteModal();
            
            if (deleteType === 'patient') {
                loadPatients();
                loadPatientOptions();
            } else {
                loadAppointments();
                loadTodayAppointments();
                loadTomorrowAppointments();
            }
        } else {
            showAlert(data.message || 'Error deleting ' + deleteType, 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Error deleting ' + deleteType, 'danger');
    });
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    document.getElementById('deleteConfirmText').value = '';
    document.getElementById('deleteConfirmError').style.display = 'none';
    document.getElementById('confirmDeleteBtn').disabled = true;
    deleteType = null;
    deleteId = null;
}

// ========================================
// IMPORT/EXPORT
// ========================================
function importData() {
    const formData = new FormData(document.getElementById('importForm'));
    
    document.getElementById('importProgress').style.display = 'block';
    document.getElementById('importProgressBar').style.width = '0%';
    document.getElementById('importStatus').textContent = 'Importing...';
    
    fetch('ajax/import.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('importProgressBar').style.width = '100%';
            document.getElementById('importStatus').textContent = 
                `Import completed! ${data.imported} records imported.`;
            showAlert('Data imported successfully!', 'success');
            
            // Reload relevant data
            loadPatients();
            loadAppointments();
            loadPatientOptions();
            
            setTimeout(() => {
                document.getElementById('importForm').reset();
                document.getElementById('importProgress').style.display = 'none';
            }, 3000);
        } else {
            document.getElementById('importStatus').textContent = 'Import failed: ' + (data.message || 'Unknown error');
            showAlert(data.message || 'Error importing data', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('importStatus').textContent = 'Import failed';
        showAlert('Error importing data', 'danger');
    });
}

function exportData() {
    const formData = new FormData(document.getElementById('exportForm'));
    
    // Create download link
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        params.append(key, value);
    }
    
    window.location.href = 'ajax/export.php?' + params.toString();
    showAlert('Export started! Download will begin shortly.', 'success');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function loadPatientOptions() {
    const formData = new FormData();
    formData.append('action', 'getPatients');
    
    fetch('ajax/patients.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const select = document.getElementById('appointmentPatient');
            select.innerHTML = '<option value="">Select Patient</option>' +
                data.patients.map(p => {
                    let info = p.patient_type;
                    if (p.patient_type === 'Student' && p.education_level) {
                        info += ` - ${p.education_level}`;
                    } else if (p.patient_type === 'Employee' && p.employee_type) {
                        info += ` - ${p.employee_type}`;
                    }
                    return `<option value="${p.id}" data-type="${p.patient_type}">${p.first_name} ${p.last_name} (${info})</option>`;
                }).join('');
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateAppointmentPatientType() {
    const select = document.getElementById('appointmentPatient');
    const selectedOption = select.options[select.selectedIndex];
    const patientType = selectedOption.getAttribute('data-type');
    document.getElementById('appointmentPatientType').value = patientType || '';
}

function loadYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 20;
    
    const yearSelects = [
        'appointmentYearFilter',
        'recordsYearFilter',
        'exportYearFrom',
        'exportYearTo'
    ];
    
    yearSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            let options = '<option value="">All Years</option>';
            for (let year = currentYear; year >= startYear; year--) {
                options += `<option value="${year}">${year}</option>`;
            }
            select.innerHTML = options;
        }
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--color-success)' : type === 'danger' ? 'var(--color-danger)' : 'var(--color-info)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideIn 0.3s ease-in-out;
        max-width: 400px;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// ==========================================
// PATIENT DETAILS MODAL FUNCTIONS
// ==========================================
let currentPatient = null;
let currentRecord = null;

function openPatientDetails(patientId, patientType) {
    currentPatient = { id: patientId, type: patientType };
    
    // Load patient information
    const formData = new FormData();
    formData.append('action', 'getPatient');
    formData.append('id', patientId);
    formData.append('type', patientType);
    
    fetch('ajax/patients.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayPatientInfo(data.patient);
            loadPatientAppointmentHistory(patientId, patientType);
            document.getElementById('patientDetailsModal').classList.add('active');
        }
    })
    .catch(error => console.error('Error:', error));
}

function displayPatientInfo(patient) {
    const fullName = `${patient.first_name} ${patient.last_name}`;
    let typeInfo = '';
    
    if (patient.patient_type === 'Student') {
        typeInfo = `${patient.education_level || ''} - ${patient.course_track || ''}`;
    } else {
        typeInfo = `${patient.employee_type || ''} - ${patient.department || ''}`;
    }
    
    document.getElementById('patientFullName').textContent = fullName;
    document.getElementById('patientTypeInfo').innerHTML = `
        <span class="badge badge-${patient.patient_type.toLowerCase()}">${patient.patient_type}</span> ${typeInfo}
    `;
    document.getElementById('patientAgeGender').textContent = `Age: ${patient.age || 'N/A'} • Gender: ${patient.gender || 'N/A'}`;
}

function loadPatientAppointmentHistory(patientId, patientType) {
    const formData = new FormData();
    formData.append('action', 'getPatientHistory');
    formData.append('patientId', patientId);
    formData.append('patientType', patientType);
    
    fetch('ajax/records.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderAppointmentHistory(data.records);
        }
    })
    .catch(error => console.error('Error:', error));
}

function renderAppointmentHistory(records) {
    const container = document.getElementById('appointmentHistoryList');
    
    if (!records || records.length === 0) {
        container.innerHTML = '<div class="history-empty">No appointment history found</div>';
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    container.innerHTML = records.map(record => {
        const recordDate = new Date(record.appointment_date);
        const isPast = recordDate < today;
        
        // Check if record has been saved (has any data in notes/reason or is completed)
        const isSaved = record.status === 'completed' || (record.reason && record.reason.trim() !== '');
        const isLocked = isPast || isSaved;
        
        const badgeClass = isLocked ? 'history-badge-locked' : 'history-badge-editable';
        const badgeText = isLocked ? '🔒 Locked' : '📝 Editable';
        
        return `
        <div class="history-item ${isLocked ? 'history-item-locked' : ''}" onclick="viewPatientRecord(${record.id})">
            <div class="history-item-header">
                <span class="history-date">${formatDate(record.appointment_date)}</span>
                <span class="history-time">${formatTime(record.appointment_time)}</span>
            </div>
            <div class="history-reason">${record.reason || record.notes || 'No reason specified'}</div>
            <span class="history-badge ${badgeClass}">${badgeText}</span>
        </div>
        `;
    }).join('');
}

function closePatientDetailsModal() {
    document.getElementById('patientDetailsModal').classList.remove('active');
    currentPatient = null;
}

function editPatientRecord() {
    if (currentPatient) {
        editPatient(currentPatient.id, currentPatient.type);
        closePatientDetailsModal();
    }
}

// ==========================================
// PATIENT RECORD VIEW/EDIT FUNCTIONS
// ==========================================
function viewPatientRecord(recordId) {
    currentRecord = recordId;
    
    const formData = new FormData();
    formData.append('action', 'getRecord');
    formData.append('recordId', recordId);
    
    fetch('ajax/records.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayRecordView(data.record);
            document.getElementById('patientRecordModal').classList.add('active');
            document.getElementById('recordViewMode').style.display = 'block';
            document.getElementById('recordEditMode').style.display = 'none';
        }
    })
    .catch(error => console.error('Error:', error));
}

function displayRecordView(record) {
    // Add orange background for view mode
    const viewCard = document.querySelector('.record-view-card');
    viewCard.classList.add('view-mode');
    
    document.getElementById('recordModalTitle').textContent = 'Appointment Record - View';
    document.getElementById('viewRecordDate').textContent = formatDate(record.appointment_date);
    document.getElementById('viewRecordTime').textContent = formatTime(record.appointment_time);
    document.getElementById('viewRecordReason').textContent = record.reason || 'Not specified';
    
    // Vitals
    document.getElementById('viewBP').textContent = record.bp || '';
    document.getElementById('viewRR').textContent = record.rr || '';
    document.getElementById('viewTemp').textContent = record.temp || '';
    
    // Weight - show just "kg" if empty, or value + " kg" if present
    if (record.weight) {
        document.getElementById('viewWeight').textContent = record.weight;
    } else {
        document.getElementById('viewWeight').textContent = 'kg';
    }
    
    document.getElementById('viewHR').textContent = record.hr || '';
    document.getElementById('viewO2Sat').textContent = record.o2sat || '';
    
    // Height - show just "cm" if empty, or value + " cm" if present  
    if (record.height) {
        document.getElementById('viewHeight').textContent = record.height;
    } else {
        document.getElementById('viewHeight').textContent = 'cm';
    }
    
    // Calculate BMI if not present but height and weight are available
    let bmiValue = record.bmi || '';
    if (!bmiValue && record.height && record.weight) {
        const height = parseFloat(record.height);
        const weight = parseFloat(record.weight);
        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            bmiValue = bmi.toFixed(1);
        }
    }
    document.getElementById('viewBMI').textContent = bmiValue;
    
    document.getElementById('viewPriorSsx').textContent = record.prior_ssx || 'Not specified';
    document.getElementById('viewPresentSsx').textContent = record.present_ssx || 'Not specified';
    document.getElementById('viewIntervention').textContent = record.intervention || 'Not specified';
    
    // Check if record has been saved (has vitals record or is from the past)
    const recordDate = new Date(record.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if record has vitals data saved
    const hasVitalsData = record.bp || record.rr || record.temp || record.weight || 
                          record.hr || record.o2sat || record.height || record.bmi || 
                          record.prior_ssx || record.present_ssx || record.intervention;
    
    const isPastRecord = recordDate < today;
    const isLocked = hasVitalsData || isPastRecord;
    
    const editButton = document.getElementById('viewModeEditBtn');
    const pastRecordInfo = document.getElementById('pastRecordInfo');
    
    if (editButton && pastRecordInfo) {
        if (isLocked) {
            // Record is locked - hide edit button and show info
            editButton.style.display = 'none';
            pastRecordInfo.style.display = 'flex';
            
            if (hasVitalsData && !isPastRecord) {
                pastRecordInfo.innerHTML = `
                    <svg style="width: 16px; height: 16px; margin-right: 8px; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    This record has been saved and cannot be edited. Create a new record for any updates.
                `;
            } else if (isPastRecord) {
                pastRecordInfo.innerHTML = `
                    <svg style="width: 16px; height: 16px; margin-right: 8px; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    This is a past record and cannot be edited.
                `;
            }
        } else {
            // Record is new/unsaved - show edit button
            editButton.style.display = 'inline-flex';
            pastRecordInfo.style.display = 'none';
        }
    }
}

function switchToEditMode() {
    if (!currentRecord) return;
    
    const formData = new FormData();
    formData.append('action', 'getRecord');
    formData.append('recordId', currentRecord);
    
    fetch('ajax/records.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayRecordEdit(data.record);
            document.getElementById('recordViewMode').style.display = 'none';
            document.getElementById('recordEditMode').style.display = 'block';
            document.getElementById('recordModalTitle').textContent = 'Appointment Record - Edit';
        }
    })
    .catch(error => console.error('Error:', error));
}

function displayRecordEdit(record) {
    document.getElementById('recordId').value = record.id;
    document.getElementById('recordPatientId').value = record.patient_id;
    document.getElementById('recordPatientType').value = record.patient_type;
    document.getElementById('recordDate').value = record.appointment_date;
    document.getElementById('recordTime').value = record.appointment_time;
    document.getElementById('recordReason').value = record.reason || '';
    
    // Vitals
    document.getElementById('recordBP').value = record.bp || '';
    document.getElementById('recordRR').value = record.rr || '';
    document.getElementById('recordTemp').value = record.temp || '';
    document.getElementById('recordWeight').value = record.weight || '';
    document.getElementById('recordHR').value = record.hr || '';
    document.getElementById('recordO2Sat').value = record.o2sat || '';
    document.getElementById('recordHeight').value = record.height || '';
    document.getElementById('recordBMI').value = record.bmi || '';
    
    document.getElementById('recordPriorSsx').value = record.prior_ssx || '';
    document.getElementById('recordPresentSsx').value = record.present_ssx || '';
    document.getElementById('recordIntervention').value = record.intervention || '';
    
    // Recalculate BMI if height and weight are present
    calculateBMI();
}

function cancelEditMode() {
    if (currentRecord) {
        viewPatientRecord(currentRecord);
    }
}

function closePatientRecordModal() {
    document.getElementById('patientRecordModal').classList.remove('active');
    currentRecord = null;
    
    // Remove orange background class
    const viewCard = document.querySelector('.record-view-card');
    if (viewCard) {
        viewCard.classList.remove('view-mode');
    }
}

function addNewRecordForPatient() {
    if (!currentPatient) return;
    
    // Reset form
    document.getElementById('patientRecordForm').reset();
    document.getElementById('recordId').value = '';
    document.getElementById('recordPatientId').value = currentPatient.id;
    document.getElementById('recordPatientType').value = currentPatient.type;
    
    // Set current date and time
    const now = new Date();
    document.getElementById('recordDate').value = now.toISOString().split('T')[0];
    document.getElementById('recordTime').value = now.toTimeString().slice(0, 5);
    
    // Show edit mode for new record
    document.getElementById('recordViewMode').style.display = 'none';
    document.getElementById('recordEditMode').style.display = 'block';
    document.getElementById('recordModalTitle').textContent = 'New Appointment Record';
    document.getElementById('patientRecordModal').classList.add('active');
    
    currentRecord = null;
}

// ==========================================
// BMI AUTO-CALCULATION
// ==========================================
function calculateBMI() {
    const heightInput = document.getElementById('recordHeight');
    const weightInput = document.getElementById('recordWeight');
    const bmiInput = document.getElementById('recordBMI');
    
    if (!heightInput || !weightInput || !bmiInput) return;
    
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    
    // Check if both values are valid numbers
    if (height > 0 && weight > 0) {
        // BMI = weight (kg) / (height (m))^2
        // Convert height from cm to m
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        // Round to 1 decimal place
        bmiInput.value = bmi.toFixed(1);
    } else {
        bmiInput.value = '';
    }
}

// Handle record form submission
document.addEventListener('DOMContentLoaded', function() {
    const recordForm = document.getElementById('patientRecordForm');
    if (recordForm) {
        recordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const recordId = document.getElementById('recordId').value;
            
            if (recordId) {
                formData.append('action', 'updateRecord');
            } else {
                formData.append('action', 'addRecord');
            }
            
            fetch('ajax/records.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert(recordId ? 'Record updated successfully' : 'Record added successfully', 'success');
                    closePatientRecordModal();
                    
                    // Reload appointment history if patient details modal is open
                    if (currentPatient) {
                        loadPatientAppointmentHistory(currentPatient.id, currentPatient.type);
                    }
                } else {
                    showAlert(data.message || 'Error saving record', 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error saving record', 'danger');
            });
        });
    }
    
    // Add event listeners for BMI calculation
    const heightInput = document.getElementById('recordHeight');
    const weightInput = document.getElementById('recordWeight');
    
    if (heightInput) {
        heightInput.addEventListener('input', calculateBMI);
        heightInput.addEventListener('change', calculateBMI);
    }
    
    if (weightInput) {
        weightInput.addEventListener('input', calculateBMI);
        weightInput.addEventListener('change', calculateBMI);
    }
});

