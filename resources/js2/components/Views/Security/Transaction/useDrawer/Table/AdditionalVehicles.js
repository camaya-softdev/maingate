/* eslint-disable max-len */
import { Input, Form } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const AdditionalVehicles = ({ data: scanData }) => {
  return (
    <Form.List name="additional_vehicles"
      initialValue={scanData.security_check.additional_vehicles?.length ? [...scanData.security_check.additional_vehicles] : []}>
      {(fields) =>
        <>
          <table className="border-collapse border border-solid border-gray-100 p-4 w-full">
            <caption style={{ captionSide: 'top' }}
              className="border border-b-0 border-solid border-gray-100 p-4 text-black font-semibold">
              Additional Vehicles
            </caption>
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-solid border-gray-100 p-4 font-semibold">
                  Model
                </th>
                <th className="border border-solid border-gray-100 p-4 font-semibold">
                  Plate Number
                </th>
              </tr>
            </thead>
            <tbody>

              {fields.map((field, index) =>
                <tr key={index}>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'model']}
                      fieldKey={[field.fieldKey, 'model']}
                      rules={[{ required: true, message: 'Model is required' }]}
                    >
                      <Input disabled="disabled" />
                    </Form.Item>
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'plate_number']}
                      fieldKey={[field.fieldKey, 'plate_number']}
                      rules={[{ required: true, message: 'Plate Number is required' }]}
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

AdditionalVehicles.propTypes = {
  data: PropTypes.object,
};

export default AdditionalVehicles;
