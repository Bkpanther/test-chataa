import React, { useState } from "react";
import { Modal, Button, Steps, Checkbox } from "antd";

const { Step } = Steps;

const StepsModal = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});

  const steps = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];

  const handleNext = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleStepCompletion = (e) => {
    setCompletedSteps({ ...completedSteps, [current]: e.target.checked });
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Open Steps Modal
      </Button>
      <Modal
        title="Multi-Step Modal"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Steps direction="vertical" current={current}>
          {steps.map((step, index) => (
            <Step
              key={index}
              title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{step}</span>
                  {index === current && (
                    <Checkbox
                      onChange={handleStepCompletion}
                      checked={completedSteps[current]}
                    >
                      Mark as Complete
                    </Checkbox>
                  )}
                </div>
              }
              status={completedSteps[index] ? "finish" : index < current ? "finish" : "wait"}
            />
          ))}
        </Steps>

        {/* Navigation buttons */}
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          {current > 0 && (
            <Button style={{ marginRight: 8 }} onClick={handlePrev}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 ? (
            <Button type="primary" onClick={handleNext} disabled={!completedSteps[current]}>
              Next
            </Button>
          ) : (
            <Button type="primary" onClick={() => setVisible(false)} disabled={!completedSteps[current]}>
              Finish
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default StepsModal;
