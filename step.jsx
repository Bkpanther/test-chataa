import React, { useState, useEffect } from "react";
import { Steps } from "antd";

const { Step } = Steps;

const DynamicSteps = () => {
  const [current, setCurrent] = useState(0);
  const [percent, setPercent] = useState(0);
  const [stepData, setStepData] = useState([
    { title: "Step 1", description: "Start process", status: "wait" },
    { title: "Step 2", description: "In progress", status: "wait" },
    { title: "Step 3", description: "Completed", status: "wait" },
  ]);

  // Simulating Backend API Call
  useEffect(() => {
    const fetchStepData = async () => {
      try {
        // Simulated API response
        const response = await new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                currentStep: 1, // Step 2 (index starts from 0)
                progress: 50, // 50% completed
                stepStatuses: ["finish", "process", "wait"], // Status for each step
              }),
            2000
          )
        );

        // Update state with backend data
        setCurrent(response.currentStep);
        setPercent(response.progress);
        setStepData((prev) =>
          prev.map((step, index) => ({
            ...step,
            status: response.stepStatuses[index], // Set status dynamically
          }))
        );
      } catch (error) {
        console.error("Error fetching step data:", error);
      }
    };

    fetchStepData();
  }, []); // Runs only once on component mount

  return (
    <div>
      <Steps current={current} percent={percent}>
        {stepData.map((step, index) => (
          <Step key={index} title={step.title} description={step.description} status={step.status} />
        ))}
      </Steps>
    </div>
  );
};

export default DynamicSteps;
