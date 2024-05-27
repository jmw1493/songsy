import { useEffect } from "react";

function FormConfirmation({
  setShowConfirmation,
}: {
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div>
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          setShowConfirmation(false);
        }}
      >
        &larr;
      </button>
      <br />
      <br />
      <br />
      <h3>Submission Successful!</h3>
    </div>
  );
}

export default FormConfirmation;
