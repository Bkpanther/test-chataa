
import React, { useState, useEffect } from "react";
import { Steps, Card, Table, Button } from "antd";
import axios from "axios";

const { Step } = Steps;

const DynamicSteps = () => {
  const [current, setCurrent] = useState(0);
  const [percent, setPercent] = useState(0);
  const [auditTrail, setAuditTrail] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [stepData, setStepData] = useState([
    { title: "Step 1", description: "Start process", status: "wait" },
    { title: "Step 2", description: "In progress", status: "wait" },
    { title: "Step 3", description: "Completed", status: "wait" },
  ]);

  // Fetch step data and logs from backend
  useEffect(() => {
    const fetchStepData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/steps");
        const logResponse = await axios.get("http://localhost:5000/logs");

        setCurrent(response.data.currentStep);
        setPercent(response.data.progress);
        setStepData((prev) =>
          prev.map((step, index) => ({
            ...step,
            status: response.data.stepStatuses[index],
          }))
        );
        setAuditTrail(logResponse.data);
      } catch (error) {
        console.error("Error fetching step data:", error);
      }
    };

    fetchStepData();
  }, []);

  // Function to update step progress and log changes
  const updateStep = async (newStep, newStatus) => {
    if (newStep >= stepData.length) return;

    const updatedSteps = stepData.map((step, index) => ({
      ...step,
      status: index === newStep ? newStatus : step.status,
    }));

    setCurrent(newStep);
    setStepData(updatedSteps);

    const logEntry = {
      step: newStep + 1,
      status: newStatus,
      timestamp: new Date().toLocaleString(),
      stepDetails: updatedSteps, // Log the full step details at this point
    };
    setAuditTrail((prev) => [...prev, logEntry]);

    // Send update to backend
    try {
      await axios.post("http://localhost:5000/update-step", {
        currentStep: newStep,
        status: newStatus,
        logEntry,
      });
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  // Table Columns for Audit Logs
  const columns = [
    { title: "Step", dataIndex: "step", key: "step" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
  ];

  return (
    <div>
      <Steps current={current} percent={percent}>
        {stepData.map((step, index) => (
          <Step key={index} title={step.title} description={step.description} status={step.status} />
        ))}
      </Steps>

      <Button onClick={() => updateStep(current + 1, "process")} disabled={current >= stepData.length - 1} style={{ marginTop: "10px" }}>
        Next Step
      </Button>

      <Button onClick={() => setShowLogs(!showLogs)} style={{ marginLeft: "10px", marginTop: "10px" }}>
        {showLogs ? "🔼 Hide Logs" : "🔽 Show Logs"}
      </Button>

      {showLogs && (
        <Card title="Audit Trail" style={{ marginTop: "20px" }}>
          <Table
            dataSource={auditTrail}
            columns={columns}
            rowKey="timestamp"
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <div>
                  <strong>Step Progression at {record.timestamp}:</strong>
                  <Steps size="small" current={record.step - 1}>
                    {record.stepDetails.map((step, index) => (
                      <Step key={index} title={step.title} description={step.description} status={step.status} />
                    ))}
                  </Steps>
                </div>
              ),
              rowExpandable: (record) => record.stepDetails && record.stepDetails.length > 0,
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default DynamicSteps;
