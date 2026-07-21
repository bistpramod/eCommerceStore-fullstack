import { useParams } from "react-router-dom";

export default function OrderSuccess() {
    const { id } = useParams();


    const goHome = () => {
        window.location.href = "/"
    }

    return (<>
        <div>
            <h1>Order Placed Successfully </h1>

            <p>Your Order Id
                <span>{id}</span>
            </p>
            <button onClick={goHome}>
                Continue Shopping
            </button>
        </div>
    </>)
}