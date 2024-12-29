import { useEffect } from 'react';
import './spinner.css';

function Spinner(): JSX.Element {
  useEffect(() => {
    document.body.style.pointerEvents = 'none';

    return () => {
      document.body.style.pointerEvents = '';
    };
  });

  return (
    <span className="loader"></span>
  );
}


export default Spinner;
