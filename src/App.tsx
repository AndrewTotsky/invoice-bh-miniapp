import PaymentForm from "./InvoiceForm";

function App(): React.JSX.Element {
    // useEffect(() => {
    //     const tg = window.Telegram.WebApp;
    //     tg.ready(); // говорит Telegram, что Mini App готово

    //     tg.expand(); // разворачивает мини-приложение
    // }, []);

    return <PaymentForm />;
}

export default App;
