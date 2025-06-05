const errorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="text-lg">We're sorry, but the page you're looking for could not be found.</p>
        <p className="text-lg">Please check the URL or return to the homepage.</p>
        <Link to="/" className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default errorPage;