import React, { useState } from 'react';
import { Button, Input } from 'antd';

const { TextArea } = Input;

const NoteColumn = ({ record, onUpdate }) => {
  const [note, setNote] = useState(record.note || '');
  const disabled = record.status === 'completed' || record.status === 'cancelled';
  const data = {
    note: note,
  }

  const handleUpdate = () => {
    onUpdate(record.id, data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <TextArea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={disabled}
      />
      {!disabled &&
        <Button color="primary" variant="filled" onClick={handleUpdate} >
          Cập nhật
        </Button>
      }
    </div>
  );
};

export default NoteColumn;
