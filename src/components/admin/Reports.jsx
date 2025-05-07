import React, { useState, useEffect } from "react";

const Reports = () => {
  const [reportType, setReportType] = useState("enrollment");
  const [filterSection, setFilterSection] = useState("all");
  const [filterQuarter, setFilterQuarter] = useState("Q1");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Define actual Grade 1 sections (6 sections)
  const grade1Sections = ["A", "B", "C", "D", "E", "F"];

  // Initialize mock student data (50 students per section)
  const [studentData, setStudentData] = useState(() => {
    // Generate actual Grade 1 students (50 per section)
    const students = [];
    const firstNames = [
      "Miguel",
      "Sofia",
      "Juan",
      "Maria",
      "Gabriel",
      "Isabella",
      "Rafael",
      "Camila",
      "Antonio",
      "Mariana",
      "Jose",
      "Angela",
      "Carlos",
      "Gabriela",
      "Andres",
      "Ana",
      "Francisco",
      "Elena",
      "Luis",
      "Beatriz",
      "Eduardo",
      "Bianca",
      "Manuel",
      "Carmen",
      "Emilio",
    ];

    const lastNames = [
      "Santos",
      "Reyes",
      "Cruz",
      "Bautista",
      "Ramos",
      "Mendoza",
      "Flores",
      "Rivera",
      "Aquino",
      "Garcia",
      "Torres",
      "Gonzales",
      "Diaz",
      "Castro",
      "Rodriguez",
      "Rosario",
      "Fernandez",
      "Morales",
      "Del Rosario",
      "Gomez",
    ];

    let studentId = 1;
    grade1Sections.forEach((section) => {
      for (let i = 0; i < 50; i++) {
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];
        const gender = Math.random() > 0.5 ? "Male" : "Female";

        // Generate birthdate for a Grade 1 student (typically 6-7 years old)
        const year = 2018 - Math.floor(Math.random() * 2); // 2017 or 2018
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        const birthdate = `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;

        // Calculate age based on birthdate
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        // Generate health metrics appropriate for grade 1 students
        const height =
          gender === "Male"
            ? Math.floor(Math.random() * 15) + 110 // 110-125 cm for boys
            : Math.floor(Math.random() * 15) + 108; // 108-123 cm for girls

        const weight =
          gender === "Male"
            ? Math.floor(Math.random() * 10) + 18 // 18-28 kg for boys
            : Math.floor(Math.random() * 10) + 17; // 17-27 kg for girls

        // Calculate BMI
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

        // Determine nutritional status based on BMI
        let nutritionalStatus;
        if (bmi < 14) nutritionalStatus = "Severely Underweight";
        else if (bmi < 15) nutritionalStatus = "Underweight";
        else if (bmi < 18.5) nutritionalStatus = "Normal";
        else if (bmi < 21) nutritionalStatus = "Overweight";
        else nutritionalStatus = "Obese";

        // Set status (most are enrolled, a few transferred)
        const status = Math.random() > 0.95 ? "Transferred In" : "Enrolled";

        // Generate random attendance data
        const daysPresent = Math.floor(Math.random() * 5) + 40; // 40-45 days present out of 45
        const daysAbsent = 45 - daysPresent;
        const attendanceRate = ((daysPresent / 45) * 100).toFixed(1);

        // Create tardy data - some students are never tardy
        const tardinessCount =
          Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;

        students.push({
          id: studentId++,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          grade: "1",
          section,
          gender,
          birthdate,
          age,
          status,
          health: {
            height,
            weight,
            bmi,
            nutritionalStatus,
            vision: Math.random() > 0.9 ? "Needs Correction" : "Normal",
            hearing: Math.random() > 0.97 ? "Needs Assistance" : "Normal",
            vaccinations: Math.random() > 0.92 ? "Incomplete" : "Complete",
            dentalHealth: Math.random() > 0.8 ? "Needs Attention" : "Good",
          },
          attendance: {
            daysPresent,
            daysAbsent,
            attendanceRate,
            tardinessCount,
          },
        });
      }
    });

    return students;
  });

  // Function to generate Grade 1 enrollment report data from real student data
  const generateEnrollmentData = () => {
    // First, filter students based on section and status if needed
    let filteredStudents = [...studentData];

    if (filterSection !== "all") {
      filteredStudents = filteredStudents.filter(
        (student) => student.section === filterSection
      );
    }

    if (filterStatus !== "all") {
      filteredStudents = filteredStudents.filter((student) => {
        if (filterStatus === "Enrolled") return student.status === "Enrolled";
        if (filterStatus === "Transferred")
          return student.status.includes("Transferred");
        return true;
      });
    }

    // Calculate totals and breakdowns
    const totalStudents = filteredStudents.length;
    const maleStudents = filteredStudents.filter(
      (student) => student.gender === "Male"
    ).length;
    const femaleStudents = filteredStudents.filter(
      (student) => student.gender === "Female"
    ).length;

    // Calculate section breakdowns
    const sectionData = {};
    grade1Sections.forEach((section) => {
      const sectionStudents = filteredStudents.filter(
        (student) => student.section === section
      );
      sectionData[section] = {
        count: sectionStudents.length,
        maleCount: sectionStudents.filter(
          (student) => student.gender === "Male"
        ).length,
        femaleCount: sectionStudents.filter(
          (student) => student.gender === "Female"
        ).length,
      };
    });

    // Convert to array format for rendering
    const bySection = Object.keys(sectionData).map((section) => ({
      section,
      count: sectionData[section].count,
      maleCount: sectionData[section].maleCount,
      femaleCount: sectionData[section].femaleCount,
    }));

    // Calculate enrollment status breakdown
    const enrolledCount = filteredStudents.filter(
      (student) => student.status === "Enrolled"
    ).length;
    const transferredInCount = filteredStudents.filter(
      (student) => student.status === "Transferred In"
    ).length;
    const byStatus = [
      { status: "Enrolled", count: enrolledCount },
      { status: "Transferred In", count: transferredInCount },
    ];

    // Calculate age distribution
    const ages = {};
    filteredStudents.forEach((student) => {
      const ageKey = `${student.age} years`;
      if (!ages[ageKey]) ages[ageKey] = 0;
      ages[ageKey]++;
    });

    const ageDistribution = Object.keys(ages)
      .map((age) => ({
        age,
        count: ages[age],
      }))
      .sort((a, b) => {
        const ageA = parseInt(a.age.split(" ")[0]);
        const ageB = parseInt(b.age.split(" ")[0]);
        return ageA - ageB;
      });

    return {
      totalStudents,
      byGender: {
        male: maleStudents,
        female: femaleStudents,
      },
      bySection,
      byStatus,
      ageDistribution,
    };
  };

  // Function to generate Grade 1 health report data from actual student data
  const generateHealthData = () => {
    // Filter students based on section if needed
    let filteredStudents = [...studentData];

    if (filterSection !== "all") {
      filteredStudents = filteredStudents.filter(
        (student) => student.section === filterSection
      );
    }

    // Calculate nutritional status totals
    const nutritionalStatuses = {};
    filteredStudents.forEach((student) => {
      const status = student.health.nutritionalStatus;
      if (!nutritionalStatuses[status]) nutritionalStatuses[status] = 0;
      nutritionalStatuses[status]++;
    });

    const nutritionalStatus = Object.keys(nutritionalStatuses)
      .map((category) => {
        const count = nutritionalStatuses[category];
        return {
          category,
          count,
          percentage: ((count / filteredStudents.length) * 100).toFixed(1),
        };
      })
      .sort((a, b) => {
        const order = [
          "Severely Underweight",
          "Underweight",
          "Normal",
          "Overweight",
          "Obese",
        ];
        return order.indexOf(a.category) - order.indexOf(b.category);
      });

    // Calculate height status (simplified for this demo)
    const heightStatus = [
      {
        category: "Severely Stunted",
        count: filteredStudents.filter((s) => s.health.height < 105).length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
      {
        category: "Stunted",
        count: filteredStudents.filter(
          (s) => s.health.height >= 105 && s.health.height < 110
        ).length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
      {
        category: "Normal",
        count: filteredStudents.filter(
          (s) => s.health.height >= 110 && s.health.height < 125
        ).length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
      {
        category: "Tall",
        count: filteredStudents.filter((s) => s.health.height >= 125).length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
    ];

    // Vision status
    const visionStatus = [
      {
        status: "Normal",
        count: filteredStudents.filter((s) => s.health.vision === "Normal")
          .length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
      {
        status: "Needs Correction",
        count: filteredStudents.filter(
          (s) => s.health.vision === "Needs Correction"
        ).length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
    ];

    // Hearing status
    const hearingStatus = [
      {
        status: "Normal",
        count: filteredStudents.filter((s) => s.health.hearing === "Normal")
          .length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
      {
        status: "Needs Assistance",
        count: filteredStudents.filter(
          (s) => s.health.hearing === "Needs Assistance"
        ).length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
    ];

    // Vaccination status
    const vaccinationStatus = [
      {
        status: "Complete",
        count: filteredStudents.filter(
          (s) => s.health.vaccinations === "Complete"
        ).length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
      {
        status: "Incomplete",
        count: filteredStudents.filter(
          (s) => s.health.vaccinations === "Incomplete"
        ).length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
    ];

    // Dental health
    const dentalHealth = [
      {
        status: "Good",
        count: filteredStudents.filter((s) => s.health.dentalHealth === "Good")
          .length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
      {
        status: "Needs Attention",
        count: filteredStudents.filter(
          (s) => s.health.dentalHealth === "Needs Attention"
        ).length,
        get percentage() {
          return ((this.count / filteredStudents.length) * 100).toFixed(1);
        },
      },
    ];

    return {
      nutritionalStatus,
      heightStatus,
      visionStatus,
      hearingStatus,
      vaccinationStatus,
      dentalHealth,
    };
  };

  // Function to generate Grade 1 attendance report data from actual student data
  const generateAttendanceData = () => {
    // Filter students based on section if needed
    let filteredStudents = [...studentData];

    if (filterSection !== "all") {
      filteredStudents = filteredStudents.filter(
        (student) => student.section === filterSection
      );
    }

    // Calculate section attendance rates
    const sectionAttendance = {};
    grade1Sections.forEach((section) => {
      const sectionStudents = filteredStudents.filter(
        (student) => student.section === section
      );
      if (sectionStudents.length > 0) {
        let totalRate = 0;
        sectionStudents.forEach((student) => {
          totalRate += parseFloat(student.attendance.attendanceRate);
        });
        sectionAttendance[section] = (
          totalRate / sectionStudents.length
        ).toFixed(1);
      } else {
        sectionAttendance[section] = "0.0";
      }
    });

    // Convert to array format for rendering
    const bySectionArray = Object.keys(sectionAttendance).map((section) => ({
      section,
      attendanceRate: sectionAttendance[section],
    }));

    // Calculate overall attendance rate
    let totalAttendanceRate = 0;
    filteredStudents.forEach((student) => {
      totalAttendanceRate += parseFloat(student.attendance.attendanceRate);
    });
    const averageAttendanceRate =
      filteredStudents.length > 0
        ? (totalAttendanceRate / filteredStudents.length).toFixed(1)
        : "0.0";

    // Calculate total days (fixed at 45 for this quarter)
    const totalDays = 45;

    // Calculate total tardiness
    let totalTardinessCount = 0;
    filteredStudents.forEach((student) => {
      totalTardinessCount += student.attendance.tardinessCount;
    });

    // Calculate tardiness by section
    const tardinessBySection = {};
    grade1Sections.forEach((section) => {
      const sectionStudents = filteredStudents.filter(
        (student) => student.section === section
      );
      let sectionTardiness = 0;
      sectionStudents.forEach((student) => {
        sectionTardiness += student.attendance.tardinessCount;
      });
      tardinessBySection[section] = sectionTardiness;
    });

    // Convert to array and sort by highest tardiness
    const tardinessBySectionArray = Object.keys(tardinessBySection)
      .map((section) => ({
        section,
        instances: tardinessBySection[section],
      }))
      .sort((a, b) => b.instances - a.instances);

    // Create absence reasons (fixed data since we don't track this in student data)
    const absenceReasons = [
      {
        reason: "Illness",
        count: Math.floor(totalTardinessCount * 0.65),
        percentage: 65.0,
      },
      {
        reason: "Family Emergency",
        count: Math.floor(totalTardinessCount * 0.15),
        percentage: 15.0,
      },
      {
        reason: "Transportation Issues",
        count: Math.floor(totalTardinessCount * 0.1),
        percentage: 10.0,
      },
      {
        reason: "Other",
        count: Math.floor(totalTardinessCount * 0.1),
        percentage: 10.0,
      },
    ];

    // Create monthly trends (fixed data since we don't track monthly)
    const monthlyTrends = [
      { month: "August", attendanceRate: 97.5 },
      { month: "September", attendanceRate: 96.2 },
      { month: "October", attendanceRate: 94.8 },
      { month: "November", attendanceRate: parseFloat(averageAttendanceRate) },
    ];

    return {
      overallAttendance: {
        totalDays,
        averageAttendanceRate,
        bySection: bySectionArray,
      },
      absenceReasons,
      monthlyTrends,
      tardinessData: {
        totalInstances: totalTardinessCount,
        averagePerDay: (totalTardinessCount / totalDays).toFixed(1),
        bySection: tardinessBySectionArray.slice(0, 5), // Top 5
      },
    };
  };

  // Get the appropriate data based on report type
  const getReportData = () => {
    switch (reportType) {
      case "enrollment":
        return generateEnrollmentData();
      case "health":
        return generateHealthData();
      case "attendance":
        return generateAttendanceData();
      default:
        return null;
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  const handleGenerateReport = () => {
    // Show loading indicator
    setIsGenerating(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Generate the data from real student data
      const data = getReportData();
      setReportData(data);

      // Hide loading indicator
      setIsGenerating(false);
    }, 800); // Simulate delay for realism
  };

  // Generate CSV content from report data
  const generateCSV = () => {
    let csvContent = "";

    // Function to convert an array of objects to CSV
    const objectsToCSV = (data, prefix = "") => {
      // Extract headers
      const headers = Object.keys(data[0]);
      csvContent += prefix + headers.join(",") + "\n";

      // Add rows
      data.forEach((item) => {
        const row = headers.map((header) => item[header]).join(",");
        csvContent += prefix + row + "\n";
      });

      csvContent += "\n"; // Add a blank line between sections
    };

    // Add title and generation date
    csvContent += `Grade 1 ${
      reportType.charAt(0).toUpperCase() + reportType.slice(1)
    } Report\n`;
    csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    // Add filtered section info
    if (filterSection !== "all") {
      csvContent += `Section: ${filterSection}\n`;
    }

    // Add appropriate report data
    if (reportType === "enrollment" && reportData) {
      csvContent += `Total Students,${reportData.totalStudents}\n`;
      csvContent += `Male Students,${reportData.byGender.male}\n`;
      csvContent += `Female Students,${reportData.byGender.female}\n\n`;

      csvContent += "Enrollment by Section:\n";
      objectsToCSV(reportData.bySection, ",");

      csvContent += "Enrollment Status:\n";
      objectsToCSV(reportData.byStatus, ",");

      csvContent += "Age Distribution:\n";
      objectsToCSV(reportData.ageDistribution, ",");
    } else if (reportType === "health" && reportData) {
      csvContent += "Nutritional Status (BMI-for-Age):\n";
      objectsToCSV(reportData.nutritionalStatus, ",");

      csvContent += "Height-for-Age Status:\n";
      objectsToCSV(reportData.heightStatus, ",");

      csvContent += "Vision Status:\n";
      objectsToCSV(reportData.visionStatus, ",");

      csvContent += "Hearing Status:\n";
      objectsToCSV(reportData.hearingStatus, ",");

      csvContent += "Vaccination Status:\n";
      objectsToCSV(reportData.vaccinationStatus, ",");

      csvContent += "Dental Health:\n";
      objectsToCSV(reportData.dentalHealth, ",");
    } else if (reportType === "attendance" && reportData) {
      csvContent += `Total School Days,${reportData.overallAttendance.totalDays}\n`;
      csvContent += `Average Attendance,${reportData.overallAttendance.averageAttendanceRate}%\n`;
      csvContent += `Tardiness Instances,${reportData.tardinessData.totalInstances}\n\n`;

      csvContent += "Attendance by Section:\n";
      objectsToCSV(reportData.overallAttendance.bySection, ",");

      csvContent += "Reasons for Absences:\n";
      objectsToCSV(reportData.absenceReasons, ",");

      csvContent += "Monthly Attendance Trends:\n";
      objectsToCSV(reportData.monthlyTrends, ",");

      csvContent += "Top 5 Sections with Tardiness:\n";
      objectsToCSV(reportData.tardinessData.bySection, ",");
    }

    return csvContent;
  };

  const handleExport = () => {
    if (!reportData) {
      alert("Please generate a report first");
      return;
    }

    setIsExporting(true);

    // Generate CSV content
    const csvContent = generateCSV();

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Set link properties
    link.href = url;
    link.setAttribute(
      "download",
      `grade1_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);

    // Trigger download and cleanup
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports">
      <div className="panel-header">
        <h2>Grade 1 Reports</h2>
      </div>

      <div className="report-controls print-hide">
        <div className="control-row">
          <div className="report-type-selector">
            <label>Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="enrollment">Enrollment Summary</option>
              <option value="health">Health Statistics</option>
              <option value="attendance">Attendance Report</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Section:</label>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
            >
              <option value="all">All Sections</option>
              {grade1Sections.map((section) => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>
          </div>

          {reportType === "attendance" && (
            <div className="filter-group">
              <label>Quarter:</label>
              <select
                value={filterQuarter}
                onChange={(e) => setFilterQuarter(e.target.value)}
              >
                <option value="Q1">1st Quarter</option>
                <option value="Q2">2nd Quarter</option>
                <option value="Q3">3rd Quarter</option>
                <option value="Q4">4th Quarter</option>
              </select>
            </div>
          )}

          {reportType === "enrollment" && (
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Transferred">Transferred</option>
              </select>
            </div>
          )}
        </div>

        <div className="control-row">
          <div className="filter-group">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="filter-group">
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="report-actions inline">
            <button
              onClick={handleGenerateReport}
              className="generate-button"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Report"}
            </button>

            <button
              onClick={handleExport}
              className="export-button"
              disabled={!reportData || isExporting}
            >
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>

            <button
              onClick={handlePrint}
              className="print-button"
              disabled={!reportData}
            >
              Print Report
            </button>
          </div>
        </div>
      </div>

      <div className="report-content">
        {/* Enrollment Report */}
        {reportType === "enrollment" && reportData && (
          <div className="enrollment-report">
            <h3>Grade 1 Enrollment Summary Report</h3>
            <p className="report-date">
              Generated on: {new Date().toLocaleDateString()}
              {filterSection !== "all" && ` | Section: ${filterSection}`}
              {filterStatus !== "all" && ` | Status: ${filterStatus}`}
            </p>

            <div className="summary-stats">
              <div className="stat-box">
                <h4>Total Students</h4>
                <p className="stat-value">{reportData.totalStudents}</p>
              </div>
              <div className="stat-box">
                <h4>Male Students</h4>
                <p className="stat-value">{reportData.byGender.male}</p>
              </div>
              <div className="stat-box">
                <h4>Female Students</h4>
                <p className="stat-value">{reportData.byGender.female}</p>
              </div>
            </div>

            <div className="report-table-container">
              <h4>Enrollment by Section</h4>
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Total</th>
                      <th>Male</th>
                      <th>Female</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.bySection.map((item) => (
                      <tr key={item.section}>
                        <td>Section {item.section}</td>
                        <td>{item.count}</td>
                        <td>{item.maleCount}</td>
                        <td>{item.femaleCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="report-row">
              <div className="report-table-container">
                <h4>Enrollment Status</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.byStatus.map((item) => (
                        <tr key={item.status}>
                          <td>{item.status}</td>
                          <td>{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="report-table-container">
                <h4>Age Distribution</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Age</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.ageDistribution.map((item) => (
                        <tr key={item.age}>
                          <td>{item.age}</td>
                          <td>{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Report */}
        {reportType === "health" && reportData && (
          <div className="health-report">
            <h3>Grade 1 Health Statistics Report</h3>
            <p className="report-date">
              Generated on: {new Date().toLocaleDateString()}
              {filterSection !== "all" && ` | Section: ${filterSection}`}
            </p>

            <div className="report-row">
              <div className="report-table-container">
                <h4>Nutritional Status (BMI-for-Age)</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.nutritionalStatus.map((item) => (
                        <tr key={item.category}>
                          <td>{item.category}</td>
                          <td>{item.count}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="report-table-container">
                <h4>Height-for-Age Status</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.heightStatus.map((item) => (
                        <tr key={item.category}>
                          <td>{item.category}</td>
                          <td>{item.count}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="report-row">
              <div className="report-table-container">
                <h4>Vision Status</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.visionStatus.map((item) => (
                        <tr key={item.status}>
                          <td>{item.status}</td>
                          <td>{item.count}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="report-table-container">
                <h4>Hearing Status</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.hearingStatus.map((item) => (
                        <tr key={item.status}>
                          <td>{item.status}</td>
                          <td>{item.count}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="report-row">
              <div className="report-table-container">
                <h4>Vaccination Status</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.vaccinationStatus.map((item) => (
                        <tr key={item.status}>
                          <td>{item.status}</td>
                          <td>{item.count}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="report-table-container">
                <h4>Dental Health</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.dentalHealth.map((item) => (
                        <tr key={item.status}>
                          <td>{item.status}</td>
                          <td>{item.count}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Report */}
        {reportType === "attendance" && reportData && (
          <div className="attendance-report">
            <h3>Grade 1 Attendance Report</h3>
            <p className="report-date">
              Generated on: {new Date().toLocaleDateString()}
              {filterSection !== "all" && ` | Section: ${filterSection}`}
              {` | ${
                filterQuarter === "Q1"
                  ? "1st"
                  : filterQuarter === "Q2"
                  ? "2nd"
                  : filterQuarter === "Q3"
                  ? "3rd"
                  : "4th"
              } Quarter`}
            </p>

            <div className="summary-stats">
              <div className="stat-box">
                <h4>Total School Days</h4>
                <p className="stat-value">
                  {reportData.overallAttendance.totalDays}
                </p>
              </div>
              <div className="stat-box">
                <h4>Average Attendance</h4>
                <p className="stat-value">
                  {reportData.overallAttendance.averageAttendanceRate}%
                </p>
              </div>
              <div className="stat-box">
                <h4>Tardiness Instances</h4>
                <p className="stat-value">
                  {reportData.tardinessData.totalInstances}
                </p>
              </div>
            </div>

            <div className="report-table-container">
              <h4>Attendance by Section</h4>
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.overallAttendance.bySection
                      .sort((a, b) => b.attendanceRate - a.attendanceRate)
                      .map((item) => (
                        <tr key={item.section}>
                          <td>Section {item.section}</td>
                          <td>{item.attendanceRate}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="report-row">
              <div className="report-table-container">
                <h4>Reasons for Absences</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Reason</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.absenceReasons.map((item) => (
                        <tr key={item.reason}>
                          <td>{item.reason}</td>
                          <td>{item.count}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="report-table-container">
                <h4>Monthly Attendance Trends</h4>
                <div className="table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Attendance Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.monthlyTrends.map((item) => (
                        <tr key={item.month}>
                          <td>{item.month}</td>
                          <td>{item.attendanceRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="report-table-container">
              <h4>Top 5 Sections with Tardiness</h4>
              <div className="table-responsive">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Instances</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.tardinessData.bySection.map((item) => (
                      <tr key={item.section}>
                        <td>Section {item.section}</td>
                        <td>{item.instances}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!reportData && !isGenerating && (
          <div className="no-report-message">
            <p>
              Please select your report criteria and click "Generate Report" to
              view data.
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="loading-report">
            <div className="loader"></div>
            <p>Generating report...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
