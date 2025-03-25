import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const MyForm = () => {
  const [form] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Form
      form={form}
      onValuesChange={(_, allValues) => {
        const { username, password, reasonSelect, customReason } = allValues;
        const isReasonValid = reasonSelect && (reasonSelect !== 'other' || (reasonSelect === 'other' && customReason));
        setSubmittable(!!username && !!password && isReasonValid);
      }}
      onFinish={async (values) => {
        const { username, password, reasonSelect, customReason } = values;
        const reason = reasonSelect === 'other' ? customReason : reasonSelect;
        const dataToSend = { username, password, reason };
        setLoading(true);
        try {
          // Simulate an API call (replace with your backend call)
          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log('Form submitted:', dataToSend);
        } catch (error) {
          console.error('Submission failed:', error);
        } finally {
          setLoading(false);
        }
      }}
    >
      #### Username Field
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>

      #### Password Field
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      #### Reason Dropdown
      <Form.Item
        name="reasonSelect"
        label="Reason"
        rules={[{ required: true, message: 'Please select a reason!' }]}
      >
        <Select placeholder="Select a reason">
          <Option value="vacation">Vacation</Option>
          <Option value="sick_leave">Sick Leave</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      #### Custom Reason Input (Conditional)
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.reasonSelect !== currentValues.reasonSelect}
      >
        {({ getFieldValue }) =>
          getFieldValue('reasonSelect') === 'other' ? (
            <Form.Item
              name="customReason"
              label="Custom Reason"
              rules={[{ required: true, message: 'Please input your custom reason!' }]}
            >
              <Input placeholder="Enter custom reason" />
            </Form.Item>
          ) : null
        }
      </Form.Item>

      #### Buttons
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!submittable}
          loading={loading}
        >
          Submit
        </Button>
        <Button
          htmlType="button"
          onClick={() => form.resetFields()}
          style={{ marginLeft: '10px' }}
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyForm;

import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';

// Define the form component
const MyForm = () => {
  // Get the form instance from antd
  const [form] = Form.useForm();

  // State to track if the form is submittable (all fields filled)
  const [submittable, setSubmittable] = useState(false);

  // State to manage the loading state of the submit button
  const [loading, setLoading] = useState(false);

  return (
    <Form
      form={form}
      // Monitor form value changes to enable/disable submit button
      onValuesChange={(_, allValues) => {
        const { username, password, reason } = allValues;
        // Enable submit button only if all fields are non-empty
        setSubmittable(!!username && !!password && !!reason);
      }}
      // Handle form submission
      onFinish={async (values) => {
        setLoading(true); // Show loading state
        try {
          // Simulate an API call (replace with actual backend call)
          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log('Form submitted:', values);
          // Add success handling here (e.g., show a success message)
        } catch (error) {
          console.error('Submission failed:', error);
          // Add error handling here (e.g., show an error message)
        } finally {
          setLoading(false); // Hide loading state
        }
      }}
    >
      {/* Username Field */}
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>

      {/* Password Field */}
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      {/* Reason Field */}
      <Form.Item
        name="reason"
        label="Reason"
        rules={[{ required: true, message: 'Please input the reason!' }]}
      >
        <Input placeholder="Enter reason" />
      </Form.Item>

      {/* Buttons */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!submittable} // Disable until all fields are filled
          loading={loading} // Show loading spinner during submission
        >
          Submit
        </Button>
        <Button
          htmlType="button"
          onClick={() => form.resetFields()} // Reset form fields
          style={{ marginLeft: '10px' }} // Add spacing between buttons
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyForm;
