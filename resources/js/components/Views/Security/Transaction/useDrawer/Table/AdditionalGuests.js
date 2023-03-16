/* eslint-disable max-len */
import { Input, Form } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const AdditionalGuests = ({ data: scanData }) => {
  return (
    <Form.List name="additional_guests"
      initialValue={scanData.security_check.additional_guests?.length ? [...scanData.security_check.additional_guests] : []}>
      {(fields) =>
        <>
          <table className="border-collapse border border-solid border-gray-100 p-4 w-full">
            <caption style={{ captionSide: 'top' }}
              className="border border-b-0 border-solid border-gray-100 p-4 text-black font-semibold">
              Additional Guests
            </caption>
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-solid border-gray-100 p-4 font-semibold">
                  First Name
                </th>
                <th className="border border-solid border-gray-100 p-4 font-semibold">
                  Last Name
                </th>
                <th className="border border-solid border-gray-100 p-4 font-semibold">
                  Age
                </th>
                <th className="border border-solid border-gray-100 p-4 font-semibold">
                  Nationality
                </th>
              </tr>
            </thead>
            <tbody>

              {fields.map((field, index) =>
                <tr key={index}>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'first_name']}
                      fieldKey={[field.fieldKey, 'first_name']}
                      rules={[{ required: true, message: 'First Name is required' }]}
                    >
                      <Input disabled="disabled" />
                    </Form.Item>
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'last_name']}
                      fieldKey={[field.fieldKey, 'last_name']}
                      rules={[{ required: true, message: 'Last Name is required' }]}
                    >
                      <Input disabled="disabled" />
                    </Form.Item>
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'age']}
                      fieldKey={[field.fieldKey, 'age']}
                    >
                      <Input disabled="disabled" />
                    </Form.Item>
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'nationality']}
                      fieldKey={[field.fieldKey, 'nationality']}
                    >
                      <Input disabled="disabled" />
                    </Form.Item>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </>
      }
    </Form.List>
  );
};

AdditionalGuests.propTypes = {
  data: PropTypes.object,
};

export default AdditionalGuests;
