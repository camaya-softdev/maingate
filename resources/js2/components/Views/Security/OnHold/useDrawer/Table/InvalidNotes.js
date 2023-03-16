/* eslint-disable max-len */
import { Input, Form } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const InvalidNotes = ({ data: scanData }) => {
  return (
    <table className="border-collapse border border-solid border-gray-100 p-4 w-full">
      <caption style={{ captionSide: 'top' }}
        className="border border-b-0 border-solid border-gray-100 p-4 text-black font-semibold">
          Notes
      </caption>
      <tbody>
        <tr>
          <td className="border border-solid border-gray-100 px-4 pt-4">
            <Form.Item name="invalid_notes" initialValue={`${scanData?.invalid_notes || ''}`}>
              <Input.TextArea rows={4} disabled="disabled" />
            </Form.Item>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

InvalidNotes.propTypes = {
  data: PropTypes.object,
};

export default InvalidNotes;
