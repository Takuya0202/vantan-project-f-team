"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    background: rgba(0, 0, 0, 0.4);
    justify-content: center;
    align-items: center;
    animation: ${fadeIn} 0.2s ease-in-out;
    z-index: 1000;
`;

const ModalContent = styled.div`
    position: relative;
    background: #fff;
    border-radius: 16px;
    padding: 40px 24px 24px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    animation: ${fadeIn} 0.3s ease-in-out;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
    border: none;
    padding: 10px 18px;
    cursor: pointer;
    color: #000;
    transition: 0.2s;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #555;
    transition: transform 0.2s ease, color 0.2s ease;

    &:hover {
        transform: rotate(90deg) scale(1.1);
        color: #000;
    }
`;

const Privacy = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>プライバシー</Button>

      {isOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()} className="text-black text-center">
            <CloseButton onClick={closeModal}></CloseButton>

            <h2 className="text-xl font-semibold mb-4">プライバシーポリシー</h2>
            <div className="leading-relaxed text-gray-700 text-left space-y-4">
              <section>
                <h3 className="font-semibold text-base mb-2">1. 個人情報の取得</h3>
                <p className="text-sm">
                  当社は、本サービスの提供にあたり、以下の個人情報を取得します。
                  <br />
                  ・ユーザーの位置情報（GPS情報）
                  <br />
                  ・認証情報（Googleアカウント情報など）
                  <br />
                  ・サービス利用履歴（検索履歴、ナビゲーション履歴など）
                  <br />
                  ・お気に入り登録情報
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">2. 個人情報の利用目的</h3>
                <p className="text-sm">
                  取得した個人情報は、以下の目的で利用します。
                  <br />
                  ・本サービスの提供・運営のため
                  <br />
                  ・ナビゲーション機能の提供のため
                  <br />
                  ・駐車場情報の検索・表示のため
                  <br />
                  ・ユーザーの利便性向上のため
                  <br />
                  ・サービスの改善・新サービスの開発のため
                  <br />
                  ・お問い合わせへの対応のため
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">3. 位置情報の取り扱い</h3>
                <p className="text-sm">
                  本サービスは、ナビゲーション機能を提供するため、ユーザーの位置情報を取得・利用します。位置情報は、目的地までのルート案内、周辺の駐車場検索などのサービス提供のためにのみ使用され、適切に管理されます。位置情報の取得は、ユーザーが許可した場合にのみ行われます。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">4. 個人情報の第三者提供</h3>
                <p className="text-sm">
                  当社は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。ただし、サービス提供に必要な範囲で、地図データ提供事業者等の業務委託先に個人情報を提供する場合があります。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">5. 個人情報の管理</h3>
                <p className="text-sm">
                  当社は、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。また、個人情報の取り扱いの全部または一部を第三者に委託する場合は、当該第三者について厳正な調査を行い、適切な監督を実施します。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">6. Cookie等の利用</h3>
                <p className="text-sm">
                  本サービスでは、ユーザーの利便性向上のため、Cookieを使用する場合があります。Cookieの使用により、ユーザーの閲覧履歴や入力内容等の情報を取得することがあります。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">7. 個人情報の開示・訂正・削除</h3>
                <p className="text-sm">
                  ユーザーは、当社に対し、個人情報の開示、訂正、削除を求めることができます。お問い合わせは、本サービス内のお問い合わせフォームからご連絡ください。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">8. プライバシーポリシーの変更</h3>
                <p className="text-sm">
                  当社は、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、本サービス上に表示した時点より効力を生じるものとします。
                </p>
              </section>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Privacy;
