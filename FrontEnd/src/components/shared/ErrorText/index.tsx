type errorProps = {
  errorMessage: string | boolean;
};

export default function ErrorText({ errorMessage }: errorProps) {
  return (
    <>
      <p className="text-danger">{errorMessage}</p>
    </>
  );
}
