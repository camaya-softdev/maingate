/* eslint-disable max-len */
import { Input, Form } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const Vehicles = ({ data, disable }) => {
  return (
    <Form.List name="vehicles"
      initialValue={data}>
      {(fields) =>
        <>
          <table className="border-collapse border border-solid border-gray-100 p-4 w-full">
            <caption style={{ captionSide: 'top' }}
              className="border border-b-0 border-solid border-gray-100 p-4 text-black font-semibold">
              Vehicles
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
                      key={`id-${index}`}
                      name={[field.name, 'id']}
                      noStyle
                      fieldKey={[field.fieldKey, 'id']}
                    >
                      <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      key={`model-${index}`}
                      name={[field.name, 'model']}
                      fieldKey={[field.fieldKey, 'model']}
                      rules={[{ required: true, message: 'Model is required' }]}
                    >
                      <Input disabled={ disable ? 'disabled' : ''} />
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
                      <Input disabled={ disable ? 'disabled' : ''} />
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

Vehicles.propTypes = {
  data: PropTypes.array,
  disable: PropTypes.bool,
};

export default Vehicles;
