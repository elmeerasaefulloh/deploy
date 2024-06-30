const { ethers } = require('ethers');
const fs = require('fs');
const readline = require('readline');

async function deployContract(provider, privateKey, abiPath, bytecodePath) {
    const wallet = new ethers.Wallet(privateKey, provider);

    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const bytecode = fs.readFileSync(bytecodePath, 'utf8');

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    //console.log('Deploying contract...');
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    console.log(`Contract deployed at address: ${contract.target}`);
}

async function deployContracts(numContracts, rpcUrl, privateKey, abiPath, bytecodePath) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    for (let i = 0; i < numContracts; i++) {
        //console.log(`Deploying contract ${i + 1}...`);
        await deployContract(provider, privateKey, abiPath, bytecodePath);
    }
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter RPC URL: ', async (rpcUrl) => {
        rl.question('Enter Private Key: ', async (privateKey) => {
            rl.question('Enter number of contracts to deploy: ', async (numContracts) => {
                const abiPath = './SimpleStorage_abi.json'; // Path to your ABI file
                const bytecodePath = './SimpleStorage_bytecode.txt'; // Path to your bytecode file

                await deployContracts(parseInt(numContracts), rpcUrl, privateKey, abiPath, bytecodePath);
                rl.close();
            });
        });
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});



