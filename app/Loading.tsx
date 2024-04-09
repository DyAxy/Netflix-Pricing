
import {
  Spinner
} from '@nextui-org/react';

export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner size='lg' label='Data Loading...' />
    </div>
  );
};