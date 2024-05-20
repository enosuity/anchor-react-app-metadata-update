import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as Web3 from '@solana/web3.js'
import { FC } from 'react'
import styles from '../styles/PingButton.module.css'
import React, { useCallback } from 'react';

// const PROGRAM_ID = new Web3.PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa")
// const PROGRAM_DATA_PUBLIC_KEY = new Web3.PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod")

import * as mpl from "@metaplex-foundation/mpl-token-metadata";
import * as anchor from '@project-serum/anchor';

export const PingButton: FC = () => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();
	
	const INITIALIZE = false;

	const onClick = useCallback(async () => {
		if (!connection || !publicKey) { 
			alert("Please connect your wallet first lol");
			return
		}
		alert(mpl.PROGRAM_ID);

		const {
				context: { slot: minContextSlot },
				value: { blockhash, lastValidBlockHeight },
		} = await connection.getLatestBlockhashAndContext();

		const transaction = new Web3.Transaction();

		const mint = new Web3.PublicKey("ANUXTcqKnKha6Cee3CgJVYkZphXX6PxDTNbiU7auUpnX");

		const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("metadata"));

    const seed2 = Buffer.from(mpl.PROGRAM_ID.toBytes());    
    const seed3 = Buffer.from(mint.toBytes());

    const [metadataPDA, _bump] = Web3.PublicKey.findProgramAddressSync([seed1, seed2, seed3], mpl.PROGRAM_ID);

		const accounts = {
			metadata: metadataPDA,
			mint,
			mintAuthority: publicKey,
			payer: publicKey,
			updateAuthority: publicKey,
		}

    const dataV2 = {
			name: "EnoSuity COIN",
			symbol: "ENO",
			uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2ADKYuqzwQwCKQtDb4fchL4Dxc8QZYcvrvTGGEGD6Ghh/logo.png",
			// we don't need that
			sellerFeeBasisPoints: 0,
			creators: null,
			collection: null,
			uses: null
		}

	let ix;
    if (INITIALIZE) {
        const args : mpl.CreateMetadataAccountV3InstructionArgs =  {
					createMetadataAccountArgsV3: {
						data: dataV2,
						isMutable: true,
						collectionDetails: null
					}
        };
        ix = mpl.createCreateMetadataAccountV3Instruction(accounts, args);
    } else {
        const args =  {
            updateMetadataAccountArgsV2: {
							data: dataV2,
							isMutable: true,
							updateAuthority: publicKey,
							primarySaleHappened: true
            }
        };
				
        ix = mpl.createUpdateMetadataAccountV2Instruction(accounts, args)
				
    }


		// const instruction = new Web3.TransactionInstruction({
		// 	keys: [
		// 		{
		// 			pubkey: PROGRAM_DATA_PUBLIC_KEY,
		// 			isSigner: false,
		// 			isWritable: true
		// 		},
		// 	],
		// 	programId: PROGRAM_ID,
		// });

		transaction.add(ix);
		console.log("Updating Metadata ... ");

		{ minContextSlot }
		let signature = await sendTransaction(transaction, connection, { minContextSlot });
		
		let confirm = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
		
		if (confirm != undefined) {
			let msgAlert = `Transaction has been confirmed with its signature ${signature}`; 
			alert(msgAlert);	
		}
		
		alert("Metadata updated successfully.");
		
	}, [publicKey, connection, sendTransaction]);

	return (
		<div className={styles.buttonContainer} onClick={onClick}>
			<button className={styles.button}>Update Metadata</button>
		</div>
	);
};