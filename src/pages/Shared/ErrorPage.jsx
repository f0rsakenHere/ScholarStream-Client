const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-error mb-4">404</h1>
      <p className="text-lg mb-6">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  );
};

export default ErrorPage;
