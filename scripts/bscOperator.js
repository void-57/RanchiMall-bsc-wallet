(function (EXPORTS) {
  //bscOperator v1.0.2
  /* ETH Crypto and API Operator */
  if (!window.ethers) return console.error("ethers.js not found");
  const bscOperator = EXPORTS;
  const isValidAddress = (bscOperator.isValidAddress = (address) => {
    try {
      // Check if the address is a valid checksum address
      const isValidChecksum = ethers.utils.isAddress(address);
      // Check if the address is a valid non-checksum address
      const isValidNonChecksum =
        ethers.utils.getAddress(address) === address.toLowerCase();
      return isValidChecksum || isValidNonChecksum;
    } catch (error) {
      return false;
    }
  });
  const BEP20ABI = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_spender",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_from",
          type: "address",
        },
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
        {
          name: "_spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      payable: true,
      stateMutability: "payable",
      type: "fallback",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
  ];
  const CONTRACT_ADDRESSES = {
    usdc: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    usdt: "0x55d398326f99059ff775485246999027b3197955",
  };
  function getProvider() {
    console.log("[DEBUG] Getting provider...");
    // switches provider based on whether the user is using MetaMask or not
    const bscMainnet = {
      chainId: 56,
      name: "binance",
      rpc: "https://bsc-dataseed.binance.org/",
      explorer: "https://bscscan.com",
    };

    if (window.ethereum) {
      console.log("[DEBUG] Using MetaMask provider");
      return new ethers.providers.Web3Provider(window.ethereum);
    } else {
      console.log("[DEBUG] Using JSON RPC provider");
      return new ethers.providers.JsonRpcProvider(bscMainnet.rpc, bscMainnet);
    }
  }
  function connectToMetaMask() {
    return new Promise((resolve, reject) => {
      // if (typeof window.ethereum === "undefined")
      //   return reject("MetaMask not installed");
      return resolve(true);
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          console.log("Connected to MetaMask");
          return resolve(accounts);
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }
  const getTransactionHistory = (bscOperator.getTransactionHistory = async (
    address
  ) => {
    try {
      if (!address || !isValidAddress(address))
        return new Error("Invalid address");
      const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=N7BFDPT7X927YVKWW4XT7VWI6RP2CH38RR`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "1") {
        return data.result.map((tx) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          timeStamp: tx.timeStamp,
          blockNumber: tx.blockNumber,
          confirmations: tx.confirmations || 0,
          gasPrice: tx.gasPrice,
          gasUsed: tx.gasUsed,
        }));
      } else {
        console.error("Error fetching transaction history:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Error:", error.message);
      return error;
    }
  });

  const getTransactionDetails = (bscOperator.getTransactionDetails = async (
    txHash
  ) => {
    try {
      if (!txHash || !/^0x([A-Fa-f0-9]{64})$/.test(txHash)) return null;
      const provider = getProvider();
      const tx = await provider.getTransaction(txHash);

      if (!tx) return null;
      const receipt = await provider.getTransactionReceipt(txHash);

      let timestamp = null;
      if (tx.blockNumber) {
        const block = await provider.getBlock(tx.blockNumber);
        timestamp = block.timestamp;
      }

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasPrice: tx.gasPrice,
        gasUsed: receipt ? receipt.gasUsed : null,
        blockNumber: tx.blockNumber,
        timeStamp: timestamp,
        status: receipt ? (receipt.status ? "success" : "failed") : "pending",
      };
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return null;
    }
  });

  const getBalance = (bscOperator.getBalance = async (address) => {
    console.log("[DEBUG] Getting balance for address:", address);
    try {
      if (!address || !isValidAddress(address)) {
        console.error("[DEBUG] Invalid address:", address);
        return new Error("Invalid address");
      }
  
      const provider = getProvider();
      console.log("[DEBUG] Provider obtained, fetching balance...");
      const balanceWei = await provider.getBalance(address);
      console.log("[DEBUG] Raw balance in Wei:", balanceWei.toString());
      const balanceEth = parseFloat(ethers.utils.formatEther(balanceWei));
      console.log("[DEBUG] Formatted balance in BNB:", balanceEth);
      return balanceEth;
    } catch (error) {
      console.error("[DEBUG] Error in getBalance:", error);
      return error;
    }
  });

  const getTokenBalance = (bscOperator.getTokenBalance = async (
    address,
    token,
    { contractAddress } = {}
  ) => {
    console.log("[DEBUG] Getting token balance for:", {
      address,
      token,
      contractAddress,
    });
    try {
      if (!address) {
        console.error("[DEBUG] Address not specified");
        throw new Error("Address not specified");
      }
      if (!token) {
        console.error("[DEBUG] Token not specified");
        throw new Error("Token not specified");
      }
      if (!CONTRACT_ADDRESSES[token] && !contractAddress) {
        console.error(
          "[DEBUG] Contract address not available for token:",
          token
        );
        throw new Error("Contract address of token not available");
      }

      const provider = getProvider();
      console.log("[DEBUG] Provider obtained, creating contract instance...");
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES[token] || contractAddress,
        BEP20ABI,
        provider
      );

      console.log("[DEBUG] Fetching token balance...");
      let balance = await contract.balanceOf(address);
      console.log("[DEBUG] Raw token balance:", balance.toString());

      const decimals = 18;
      console.log("[DEBUG] Using decimals:", decimals);
      balance = parseFloat(ethers.utils.formatUnits(balance, decimals));
      console.log("[DEBUG] Formatted token balance:", balance);

      return balance;
    } catch (e) {
      console.error("[DEBUG] Error in getTokenBalance:", e);
      throw e;
    }
  });

  //  Example usage:
  // Ensure MetaMask is connected and BSC network is selected in MetaMask
  const address = "0xYourAddressHere"; // Replace with your actual address
  (async () => {
    try {
      const usdtBalance = await getTokenBalance(address, "USDT");
      const bnbBalance = await getTokenBalance(address, "BNB");
      console.log("USDT Balance:", usdtBalance);
      console.log("BNB Balance:", bnbBalance);
    } catch (error) {
      console.error("Error fetching balances:", error.message);
    }
  })();

  const estimateGas = (bscOperator.estimateGas = async ({
    privateKey,
    receiver,
    amount,
  }) => {
    try {
      const provider = getProvider();
      const signer = new ethers.Wallet(privateKey, provider);
      return provider.estimateGas({
        from: signer.address,
        to: receiver,
        value: ethers.utils.parseUnits(amount, "ether"),
      });
    } catch (e) {
      throw new Error(e);
    }
  });

  const sendTransaction = (bscOperator.sendTransaction = async ({
    privateKey,
    receiver,
    amount,
  }) => {
    console.log("[DEBUG] Sending transaction:", { receiver, amount });
    try {
      const provider = getProvider();
      console.log("[DEBUG] Provider obtained, creating signer...");
      const signer = new ethers.Wallet(privateKey, provider);
      console.log("[DEBUG] Signer address:", signer.address);

      console.log("[DEBUG] Estimating gas...");
      const limit = await estimateGas({ privateKey, receiver, amount });
      console.log("[DEBUG] Estimated gas limit:", limit.toString());

      console.log("[DEBUG] Creating transaction...");
      const tx = await signer.sendTransaction({
        to: receiver,
        value: ethers.utils.parseUnits(amount, "ether"),
        gasLimit: limit,
        nonce: await signer.getTransactionCount(),
        maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"),
      });

      console.log("[DEBUG] Transaction sent, hash:", tx.hash);
      return tx;
    } catch (e) {
      console.error("[DEBUG] Error in sendTransaction:", e);
      throw e;
    }
  });

  const sendToken = (bscOperator.sendToken = async ({
    token,
    privateKey,
    amount,
    receiver,
    contractAddress,
  }) => {
    console.log("[DEBUG] Sending token:", { token, amount, receiver });
    try {
      const wallet = new ethers.Wallet(privateKey, getProvider());
      console.log("[DEBUG] Wallet created, address:", wallet.address);

      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES[token] || contractAddress,
        BEP20ABI,
        wallet
      );
      console.log("[DEBUG] Token contract created");

      const decimals = await tokenContract.decimals();
      console.log("[DEBUG] Token decimals:", decimals);

      const amountWei = ethers.utils.parseUnits(amount.toString(), decimals);
      console.log("[DEBUG] Amount in Wei:", amountWei.toString());

      console.log("[DEBUG] Estimating gas...");
      const gasLimit = await tokenContract.estimateGas.transfer(
        receiver,
        amountWei
      );
      console.log("[DEBUG] Estimated gas limit:", gasLimit.toString());

      const gasPrice = await wallet.provider.getGasPrice();
      console.log("[DEBUG] Current gas price:", gasPrice.toString());

      const gasCost = gasPrice.mul(gasLimit);
      console.log(
        "[DEBUG] Estimated gas cost:",
        ethers.utils.formatEther(gasCost)
      );

      const balance = await wallet.getBalance();
      console.log(
        "[DEBUG] Wallet BNB balance:",
        ethers.utils.formatEther(balance)
      );

      if (balance.lt(gasCost)) {
        console.error("[DEBUG] Insufficient BNB for gas");
        throw new Error("Insufficient funds for gas fee");
      }

      console.log("[DEBUG] Sending token transfer...");
      const tx = await tokenContract.transfer(receiver, amountWei, {
        gasLimit,
        gasPrice,
      });
      console.log("[DEBUG] Token transfer sent, hash:", tx.hash);
      return tx;
    } catch (e) {
      console.error("[DEBUG] Error in sendToken:", e);
      throw e;
    }
  });
})("object" === typeof module ? module.exports : (window.bscOperator = {}));
