"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

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

// 同意するボタン
const AgreeButton = styled.button`
    margin-top: 24px;
    padding: 10px 20px;
    --tw-bg-opacity: 1;
    background-color: rgba(6, 95, 70, var(--tw-bg-opacity));
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
        --tw-bg-opacity: 1;
        background-color: rgba(6, 78, 59, var(--tw-bg-opacity));
        transform: scale(1.03);
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
                <CloseButton onClick={closeModal}>
                </CloseButton>

                <h2 className="text-xl font-semibold mb-4">プライバシー規約</h2>
                <p className="leading-relaxed text-gray-700">
                ！！！！！！本文書く場所！！！！！！<br />
                src/app/components/privacy.tsxにある
                </p>

                <AgreeButton onClick={closeModal}>同意する</AgreeButton>
            </ModalContent>
            </ModalOverlay>
        )}
        </div>
    );
};

export default Privacy;
