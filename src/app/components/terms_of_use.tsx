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

const Terms_of_use = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>利用規約</Button>

      {isOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()} className="text-black text-center">
            <CloseButton onClick={closeModal}></CloseButton>

            <h2 className="text-xl font-semibold mb-4">利用規約</h2>
            <div className="leading-relaxed text-gray-700 text-left space-y-4">
              <section>
                <h3 className="font-semibold text-base mb-2">第1条（適用）</h3>
                <p className="text-sm">
                  本規約は、本サービスの提供条件及び本サービスの利用に関する当社とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">第2条（定義）</h3>
                <p className="text-sm">
                  本規約において使用する用語の定義は、次のとおりとします。
                  <br />
                  (1)「本サービス」とは、当社が提供するナビゲーション・駐車場検索サービスを意味します。
                  <br />
                  (2)「ユーザー」とは、本サービスを利用する全ての方を意味します。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">第3条（利用登録）</h3>
                <p className="text-sm">
                  本サービスの利用を希望する方は、本規約を遵守することに同意し、当社の定める方法によって利用登録を申請することができます。当社は、利用登録の承認をもって、本サービスの利用を許諾します。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">第4条（位置情報の利用）</h3>
                <p className="text-sm">
                  本サービスは、ナビゲーション機能を提供するため、ユーザーの位置情報を取得します。位置情報の取得・利用については、プライバシーポリシーに従って適切に管理されます。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">第5条（禁止事項）</h3>
                <p className="text-sm">
                  ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
                  <br />
                  (1)法令または公序良俗に違反する行為
                  <br />
                  (2)犯罪行為に関連する行為
                  <br />
                  (3)本サービスの運営を妨害するおそれのある行為
                  <br />
                  (4)他のユーザーまたは第三者の権利を侵害する行為
                  <br />
                  (5)その他、当社が不適切と判断する行為
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">第6条（免責事項）</h3>
                <p className="text-sm">
                  当社は、本サービスの内容変更、中断、終了によって生じたいかなる損害についても、一切責任を負いません。また、本サービスの情報の正確性、完全性について保証するものではありません。運転中は必ず交通法規を遵守し、安全運転を心がけてください。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">第7条（サービス内容の変更等）</h3>
                <p className="text-sm">
                  当社は、ユーザーへの事前の告知なく、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを予め承諾するものとします。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">第8条（規約の変更）</h3>
                <p className="text-sm">
                  当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の規約は、本サービス上に表示した時点より効力を生じるものとします。
                </p>
              </section>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Terms_of_use;
