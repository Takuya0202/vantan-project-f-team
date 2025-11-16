import Link from "next/link";

export default function AuthError() {
  return (
    <div>
      <h1>認証に失敗しました</h1>
      <Link href="/">ホームに戻る</Link>
    </div>
  );
}
