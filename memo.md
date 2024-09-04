### To compile contracts

```
npx hardhat compile
```

### To test contracts

```
npx hardhat test
```

### To run hardhat local network

```
npx hardhat node
```

### To deploy to hardhat local network

```
npx hardhat ignition deploy ./ignition/modules/JavierToken.js --network localhost
```

### To deploy to sepolia

```
npx hardhat ignition wipe chain-11155111 JavierTokenModule#JavierToken
npx hardhat ignition deploy ./ignition/modules/JavierToken.js --network sepolia
```

**Remember to copy contract abi.json after compiling to frontend**
