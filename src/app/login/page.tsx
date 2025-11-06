import Image from "next/image"
import Privacy from "../components/privacy"
import Terms_of_use from "../components/terms_of_use"
import GuestLogin from "../components/guest_login"
import InputField from "@/app/components/inputfield";

export default function Home() {
    return (
        <main className="w-full">
            <div className="flex flex-col items-center justify-center space-y-3 mt-[30%]">
                <h1 className="text-2xl font-bold border-b pb-4 mb-12 w-[70%] text-center">
                    Login
                </h1>
                <InputField />
                <h2 className="text-xl">
                    or
                </h2>
                <GuestLogin />
            </div>
            
            <div className="flex justify-between items-center w-full text-xs mt-[10%]">
                <Terms_of_use />
                <Privacy />
            </div>
            
        </main>
    );
}
