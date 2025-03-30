import React, { useState } from "react";

const Reports = () => {
  const [reportType, setReportType] = useState("enrollment");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Function to generate enrollment report data (mock)
  const generateEnrollmentData = () => {
    const data = {
      totalStudents: 325,
      byGrade: [
        { grade: "1", count: 60, maleCount: 28, femaleCount: 32 },
        { grade: "2", count: 58, maleCount: 30, femaleCount: 28 },
        { grade: "3", count: 55, maleCount: 25, femaleCount: 30 },
        { grade: "4", count: 52, maleCount: 27, femaleCount: 25 },
        { grade: "5", count: 50, maleCount: 24, femaleCount: 26 },
        { grade: "6", count: 50, maleCount: 26, femaleCount: 24 },
      ],
      bySection: [
        { section: "A", count: 120 },
        { section: "B", count: 115 },
        { section: "C", count: 90 },
      ],
    };

    // Apply grade filter if not 'all'
    if (gradeFilter !== "all") {
      data.byGrade = data.byGrade.filter((item) => item.grade === gradeFilter);
      const gradeTotalStudents = data.byGrade.reduce(
        (total, item) => total + item.count,
        0
      );
      data.totalStudents = gradeTotalStudents;
    }

    // Apply section filter if not 'all'
    if (sectionFilter !== "all") {
      data.bySection = data.bySection.filter(
        (item) => item.section === sectionFilter
      );
    }

    return data;
  };

  // Function to generate health report data (mock)
  const generateHealthData = () => {
    const data = {
      bmiCategories: [
        { category: "Underweight", count: 48, percentage: 14.8 },
        { category: "Normal", count: 215, percentage: 66.2 },
        { category: "Overweight", count: 40, percentage: 12.3 },
        { category: "Obese", count: 22, percentage: 6.7 },
      ],
      visionStatus: [
        { status: "Normal", count: 290, percentage: 89.2 },
        { status: "Needs Correction", count: 35, percentage: 10.8 },
      ],
      hearingStatus: [
        { status: "Normal", count: 315, percentage: 96.9 },
        { status: "Needs Assistance", count: 10, percentage: 3.1 },
      ],
      vaccinationStatus: [
        { status: "Complete", count: 300, percentage: 92.3 },
        { status: "Incomplete", count: 25, percentage: 7.7 },
      ],
    };

    return data;
  };

  // Get the appropriate data based on report type
  const getReportData = () => {
    switch (reportType) {
      case "enrollment":
        return generateEnrollmentData();
      case "health":
        return generateHealthData();
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
    // In a real app, this would trigger an API call to generate the report
    console.log("Generating report:", {
      type: reportType,
      gradeFilter,
      sectionFilter,
      dateRange,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // In a real app, this would trigger an export function
    alert("Export functionality would be implemented here (CSV, Excel, PDF)");
  };

  const reportData = getReportData();

  return (
    <div className="reports">
      <div className="panel-header">
        <h2>Reports</h2>
      </div>

      <div className="report-controls">
        <div className="report-type-selector">
          <label>Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="enrollment">Enrollment Summary</option>
            <option value="health">Health Statistics</option>
          </select>
        </div>

        <div className="report-filters">
          {reportType === "enrollment" && (
            <>
              <div className="filter-group">
                <label>Grade:</label>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                >
                  <option value="all">All Grades</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Section:</label>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                >
                  <option value="all">All Sections</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </>
          )}

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

          <button onClick={handleGenerateReport} className="generate-button">
            Generate Report
          </button>
        </div>
      </div>

      <div className="report-content">
        {reportType === "enrollment" && reportData && (
          <div className="enrollment-report">
            <h3>Enrollment Summary Report</h3>
            <p className="report-date">
              Generated on: {new Date().toLocaleDateString()}
            </p>

            <div className="summary-stats">
              <div className="stat-box">
                <h4>Total Students</h4>
                <p className="stat-value">{reportData.totalStudents}</p>
              </div>
            </div>

            <div className="enrollment-tables">
              <div className="grade-enrollment">
                <h4>Enrollment by Grade</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Grade</th>
                      <th>Total</th>
                      <th>Male</th>
                      <th>Female</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.byGrade.map((item) => (
                      <tr key={item.grade}>
                        <td>Grade {item.grade}</td>
                        <td>{item.count}</td>
                        <td>{item.maleCount}</td>
                        <td>{item.femaleCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="section-enrollment">
                <h4>Enrollment by Section</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.bySection.map((item) => (
                      <tr key={item.section}>
                        <td>Section {item.section}</td>
                        <td>{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {reportType === "health" && reportData && (
          <div className="health-report">
            <h3>Health Statistics Report</h3>
            <p className="report-date">
              Generated on: {new Date().toLocaleDateString()}
            </p>

            <div className="health-tables">
              <div className="bmi-stats">
                <h4>BMI Categories</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.bmiCategories.map((item) => (
                      <tr key={item.category}>
                        <td>{item.category}</td>
                        <td>{item.count}</td>
                        <td>{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="vision-stats">
                <h4>Vision Status</h4>
                <table>
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

              <div className="hearing-stats">
                <h4>Hearing Status</h4>
                <table>
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

              <div className="vaccination-stats">
                <h4>Vaccination Status</h4>
                <table>
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
          </div>
        )}
      </div>

      <div className="report-actions">
        <button onClick={handlePrint} className="print-button">
          Print Report
        </button>
        <button onClick={handleExport} className="export-button">
          Export Report
        </button>
      </div>
    </div>
  );
};

export default Reports;
