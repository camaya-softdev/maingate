/* eslint-disable max-len */
import { Button, Input, Form } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';

const AdditionalVehicles = ({ data }) => {
  return (
    <Form.List name="additional_vehicles"
      initialValue={data}>
      {(fields, { add, remove }) =>
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
                <th className="border border-solid border-gray-100 p-4 w-1">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => add()} />
                </th>
              </tr>
            </thead>
            <tbody>

              {fields.map((field, index) =>
                <tr key={index}>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      key={`model-${index}`}
                      name={[field.name, 'model']}
                      fieldKey={[field.fieldKey, 'model']}
                      rules={[{ required: true, message: 'Model is required' }]}
                    >
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      key={`plate_number-${index}`}
                      name={[field.name, 'plate_number']}
                      fieldKey={[field.fieldKey, 'plate_number']}
                      rules={[{ required: true, message: 'Plate Number is required' }]}
                    >
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4 align-top">
                    <Button
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(field.name)} />
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
  data: PropTypes.array,
};

export default AdditionalVehicles;
