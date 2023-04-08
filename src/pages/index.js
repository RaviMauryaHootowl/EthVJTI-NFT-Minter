import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import html2canvas from "html2canvas";
import { Biconomy } from "@biconomy/mexa";
import NFTABI from "../artifacts/ETHVJTIABI.json";
import { env } from "../../next.config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BeatLoader } from "react-spinners";
import Link from "next/link";
import Head from "next/head";

const HomePageBackground = styled.div`
    width: 100%;
    min-height: 100vh;
    background-image: linear-gradient(to bottom, #3646ad, #584193);
    display: flex;
    flex-direction: column;
`;

const NavbarContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    img {
        height: 4rem;
        margin-right: 1rem;
    }
    span {
        color: white;
        font-weight: bold;
        font-size: 1.8rem;
    }
`;

const ConnectWalletBtn = styled.button`
    background-image: linear-gradient(to bottom, #d9d9d9, #ccdbff);
    border: none;
    outline: none;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    color: #423aaa;
    font-size: 1rem;
    transition: all 0.5s ease;
    margin-left: 1rem;
    &:hover {
        transform: translateY(-3px);
    }
    &:active {
        transform: translateY(4px);
    }
`;

const MainContentContainer = styled.div`
    padding: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const NFTCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const HideLayer = styled.div`
    overflow: hidden;
    height: 0;
`;

const NFTImage = styled.div`

    width: ${props => (props.big ? "500px" : "280px")};
    height: ${props => (props.big ? "714px" : "400px")};
    background-image: url('/nfttemplate.png');
    background-size: contain;
    background-repeat: no-repeat;
    border-radius: 1rem;
    margin-bottom: 1rem;
    transition: all 0.5s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    &:hover {
        transform: rotateZ(-2deg) scale(1.05);
        box-shadow: #0000005a 4px 4px 40px;
    }
`;

const NFTImageTop = styled.div`
    flex: 9;
`

const NFTImageBottom = styled.div`
    flex: 2;
    color: white;
    font-family: 'RedHatMono', monospace;
    font-size: ${props => (props.big ? "2.7rem" : "1.6rem")};
`;

const NFTName = styled.span`
    font-size: 2rem;
    font-weight: bold;
    color: white;
    margin-bottom: 2rem;
`;

const ClaimBtn = styled.button`
    background-image: linear-gradient(to bottom, #a26dff, #7d2dff);
    border: none;
    outline: none;
    padding: 0.8rem 3rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    color: white;
    font-size: 1rem;
    transition: all 0.5s ease;
    &:hover {
        transform: translateY(-3px);
    }
    &:active {
        transform: translateY(4px);
    }
`;

const NameInput = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 8px;
    padding: 0.5rem;
    input {
        border: none;
        outline: none;
        padding: 0 0.5rem;
        font-size: 1rem;
    }
`;

const ModalContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ModalHeader = styled.div`
    font-weight: bold;
    margin-bottom: 1rem;
`;

const EmailInput = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 8px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    input {
        flex: 1;
        min-width: 20px;
        border: none;
        outline: none;
        padding: 0 0.5rem;
        font-size: 1rem;
    }
`;

const emailVerifyModalStyles = {
    content: {
        width: "90%",
        maxWidth: "500px",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        borderRadius: "1rem",
        backgroundImage: "linear-gradient(to bottom, #f3eaff, #dfd8ff)",
        boxShadow: "#0000005c 5px 5px 100px",
    },
    overlay: {
        background: "#000000a0",
        zIndex: 1000,
    },
};

const Home = () => {
    const [isEmailVerifyModalOpen, setIsEmailVerifyModalOpen] = useState(false);
    const web3Storage = new Web3Storage({ token: env.WEB3_STORAGE_API });
    const [address, setAddress] = useState("");
    const [username, setUsername] = useState("");
    const [emailId, setEmailId] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const generateNFTImage = async () => {
        const element = document.getElementById("nftcard");
        const canvas = await html2canvas(element);

        // var link = document.createElement('a');
        // link.download = 'filename.png';
        // link.href = canvas.toDataURL()
        // link.click();

        const blob = await new Promise((resolve) => canvas.toBlob(resolve));
        var file = new File([blob], "nftImage");
        return file;
    };

    const uploadImageToIPFS = async (imageFile) => {
        const cid = await web3Storage.put([imageFile]);
        return cid;
    };

    const mintNFT = async () => {
        try{

        
        if(isLoading){ return; }
        //verify otp first
        const isOTPCorrect = await verifyOTP(otp);
        if(!isOTPCorrect){
          toast.error("OTP is incorrect!");
          return;
        }

        setIsLoading(true);
        const nftImage = await generateNFTImage();
        console.log(nftImage);
        const cid = await uploadImageToIPFS(nftImage);
        console.log(cid);
        const tokenUriJson = {
            image: `https://${cid}.ipfs.w3s.link/nftImage`,
            external_url: "https://www.communityofcoders.in/",
            image_preview_url: `https://${cid}.ipfs.w3s.link/nftImage`,
            name: "EthVJTI Launch NFT",
            description: "Attendees NFT for EthVJTI Launch Event",
        };
        const blob = new Blob([JSON.stringify(tokenUriJson)]);
        var jsonFile = new File([blob], "nftUri");
        const uriCid = await uploadImageToIPFS(jsonFile);
        console.log(uriCid);

        const rpcProvider = window.ethereum;
        const contract_address = env.CONTRACT_ADDRESS;
        console.log(contract_address);
        console.log(NFTABI);
        const biconomy = new Biconomy(rpcProvider, {
            apiKey: env.BICONOMY_API,
            debug: true,
            contractAddresses: [contract_address],
        });
        console.log(biconomy);
        await biconomy.init();
        const provider = await biconomy.provider;
        const contractInstance = new ethers.Contract(
            contract_address,
            NFTABI,
            biconomy.ethersProvider
        );
        console.log("contract instance", contractInstance);
        const { data } = await contractInstance.populateTransaction.userMint(
            `https://${uriCid}.ipfs.w3s.link/nftUri`
        );
        
        let txParams = {
            data: data,
            to: contract_address,
            from: address,
            signatureType: "EIP712_SIGN",
        };

        const res = await provider.send("eth_sendTransaction", [txParams]);
        console.log(res);

        biconomy.on("txHashGenerated", (data) => {
            console.log(data);
        });

        biconomy.on("txMined", (data) => {
            console.log(data);
            setNFTMinted(emailId);
            setIsLoading(false);
            closeEmailVerifyModal();
            toast.success("NFT Minted! 🥳");
        });

        biconomy.on("onError", (data) => {
            console.log(data);
            setIsLoading(false);
        });

        biconomy.on("txHashChanged", (data) => {
            console.log(data);
        });
    }catch(err){
        console.log(err);
        toast.error("We ran into some error! Try again.");
    }
    };

    const openEmailVerifyModal = () => {
        if(address == ""){
          toast.error("Connect your wallet first");
          return;
        }
        if(username.trim() == ""){
          toast.error("Enter your name first");
          return;
        }
        setIsEmailVerifyModalOpen(true);
    };
    const closeEmailVerifyModal = () => {
        setIsEmailVerifyModalOpen(false);
    };

    useEffect(() => {
        addWalletListener();
    }, []);

    const handleMetamaskConnectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: ethers.utils.hexValue(137) }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: ethers.utils.hexValue(137),
                                rpcUrls: [
                                    "https://polygon-rpc.com/",
                                ],
                                chainName: "Polygon",
                                nativeCurrency: {
                                    name: "MATIC",
                                    symbol: "MATIC",
                                    decimals: 18,
                                },
                                blockExplorerUrls: [
                                    "https://polygonscan.com/",
                                ],
                            },
                        ],
                    });
                }
            }

            const web3 = new ethers.providers.Web3Provider(
                window.ethereum,
                "any"
            );
            await web3.send("eth_requestAccounts", []);
            const signer = web3.getSigner();
            setAddress(await signer.getAddress());
        } else {
            alert("install metamask");
        }
    };

    const addWalletListener = () => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                setAddress(accounts[0]);
            });
        }
    };


    const handleSendOTP = async () => {
        if(isLoading){ return; }
      try{
        const res = await axios.post(
            "https://www.communityofcoders.in/server/api/ethvjti/sendotp",
            {
                email: emailId,
                walletAddress: address,
            }
        );
        console.log(res.data.message);
        toast.success(`${res.data.message}`);
      }catch(err){
        console.log(err.response.data.error);
        toast.error(err.response.data.error);
      }
    };

    const verifyOTP = async (otpCode) => {
        if(otpCode.trim() == ""){
            return false;
        }
      try{
        const res = await axios.get(
          "https://www.communityofcoders.in/server/api/ethvjti/verifyotp",{
            params: {
                email: emailId,
                otp: otpCode,
            }
          }
        );
        return true;
      }catch(err){
        return false;
      }
    }

    const setNFTMinted = async (userEmail) => {
        try{
            const res = await axios.post(
                "https://www.communityofcoders.in/server/api/ethvjti/setminted",
                {
                    email: userEmail,
                    walletAddress: address,
                }
            );
            console.log(res.data.message);
          }catch(err){
            console.log(err.response.data.error);
          }
    }

    return (
        <HomePageBackground>
            <Head>
                <title>EthVJTI Minter</title>
            </Head>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
            <ToastContainer />
            <Modal
                isOpen={isEmailVerifyModalOpen}
                onRequestClose={closeEmailVerifyModal}
                style={emailVerifyModalStyles}
                contentLabel="Example Modal"
            >
                <ModalContainer>
                    <ModalHeader>Verify Email ID</ModalHeader>
                    <EmailInput>
                        <input
                            placeholder="Your Email ID"
                            type="text"
                            value={emailId}
                            onChange={(e) => {
                                setEmailId(e.target.value);
                            }}
                        />
                        <ClaimBtn onClick={handleSendOTP}>Send OTP</ClaimBtn>
                    </EmailInput>
                    <EmailInput>
                        <input
                            placeholder="Enter OTP"
                            type="text"
                            value={otp}
                            onChange={(e) => {
                                setOtp(e.target.value);
                            }}
                        />
                    </EmailInput>
                    <ClaimBtn
                        onClick={() => {
                            mintNFT();
                        }}
                    >
                        {isLoading ? <BeatLoader size={10} color={"#ffffff"} /> : "Mint"}
                    </ClaimBtn>
                </ModalContainer>
            </Modal>
            <NavbarContainer>
                <Logo>
                    <img src={"/logo.svg"} />
                    <span>EthVJTI Minter</span>
                </Logo>
                <div>
                    <Link href={"https://opensea.io/collection/ethvjti-token"} target="_blank">
                        <ConnectWalletBtn>
                            View NFTs
                        </ConnectWalletBtn>
                    </Link>
                    <ConnectWalletBtn onClick={handleMetamaskConnectWallet}>
                        {address == ""
                            ? "Connect Wallet"
                            : `${address.substring(0, 6)}...${address.substring(
                                38
                            )}`}
                    </ConnectWalletBtn>
                </div>
            </NavbarContainer>
            <MainContentContainer>
                <NFTCard>
                    <NFTImage big={false}>
                        <NFTImageTop></NFTImageTop>
                        <NFTImageBottom>0x{username}</NFTImageBottom>
                    </NFTImage>
                    <HideLayer>
                        <NFTImage big={true}  id="nftcard">
                            <NFTImageTop></NFTImageTop>
                            <NFTImageBottom big={true}>0x{username}</NFTImageBottom>
                        </NFTImage>
                    </HideLayer>
                    <NFTName>EthVJTI Launch NFT</NFTName>
                    <NameInput>
                        <input
                            value={username}
                            placeholder="Your Name"
                            type="text"
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            maxLength={13}
                        />
                        <ClaimBtn
                            onClick={() => {
                                if(env.IS_LIVE == "yes"){
                                    openEmailVerifyModal();
                                }else{
                                    toast.info("Minter is not live yet!");
                                }
                            }}
                        >
                            Mint
                        </ClaimBtn>
                    </NameInput>
                </NFTCard>
            </MainContentContainer>
        </HomePageBackground>
    );
};

export default Home;
