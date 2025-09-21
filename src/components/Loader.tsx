import Loader from "@/components/Loader";

export default function Page() {
    const isLoading = true; // replace with your actual state

    return (
        <div className="min-h-screen flex items-center justify-center">
            {isLoading ? <Loader /> : <p>Data loaded ✅</p>}
        </div>
    );
}
