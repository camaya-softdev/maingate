/* eslint-disable max-len */
import { Button, Input, Form } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';

const AdditionalGuests = ({ data }) => {
  return (
    <Form.List name="additional_guests"
      initialValue={data}>
      {(fields, { add, remove }) =>
        <>
          <table className="border-collapse border border-solid border-gray-100 p-4 w-full">
            <caption style={{ captionSide: 'top' }}
              className="border border-b-0 border-solid border-gray-100 p-4 text-black font-semibold">
              Additional Guests
            </caption>
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-solid border-gray-100 p-4 font-semibold">
                  #
                </th>
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
                    {index + 1}
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'first_name']}
                      fieldKey={[field.fieldKey, 'first_name']}
                      rules={[{ required: true, message: 'First Name is required' }]}
                    >
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'last_name']}
                      fieldKey={[field.fieldKey, 'last_name']}
                      rules={[{ required: true, message: 'Last Name is required' }]}
                    >
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'age']}
                      fieldKey={[field.fieldKey, 'age']}
                      rules={[{ required: true, message: 'Age is required' }]}
                    >
                      <Input />
                    </Form.Item>
                  </td>
                  <td className="border border-solid border-gray-100 px-4 pt-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'nationality']}
                      fieldKey={[field.fieldKey, 'nationality']}
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

AdditionalGuests.propTypes = {
  data: PropTypes.array,
};

export default AdditionalGuests;
