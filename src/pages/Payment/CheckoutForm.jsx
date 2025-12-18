const CheckoutForm = () => {
  return (
    <form className="space-y-4">
      {/* Stripe Elements will be integrated here */}
      <button className="btn btn-primary w-full" type="submit">
        Pay Now
      </button>
    </form>
  );
};

export default CheckoutForm;
