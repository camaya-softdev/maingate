/* eslint-disable max-len */
import { Input, Form } from 'antd';
import React from 'react';

const ReferenceNumber = () => {
  return (
    <table className="border-collapse border border-solid border-gray-100 p-4 w-full">
      <caption style={{ captionSide: 'top' }}
        className="border border-b-0 border-solid border-gray-100 p-4 text-black font-semibold">
          Reference Code
      </caption>
      <tbody>
        <tr>
          <td className="border border-solid border-gray-100 px-4 pt-4">
            <Form.Item
              name="code">
              <Input />
            </Form.Item>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ReferenceNumber;
