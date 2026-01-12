import CheckoutForm from "@/components/CheckoutForm";
import StripeProvider from "@/components/providers/StripeProvider";

const PaymentPage = () => {
    return (
        <StripeProvider>
            <CheckoutForm/>
        </StripeProvider>
    );
}

export default PaymentPage;