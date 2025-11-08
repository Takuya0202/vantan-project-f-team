import GoogleLogin from "@/app/feature/auth/google-login";
export default function Login() {
    return (
        <div className="flex justify-center items-center h-screen">
            <GoogleLogin />
        </div>
    )
}