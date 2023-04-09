import { FunctionComponent, useState } from "react";
// import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

// import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getItemPath } from "../../utils/clientDataAccess";
import { Article } from "../../types/Article";
import { Box, Container, Fab, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
// import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Template from "../Template";
import { useSession } from "next-auth/react";

interface Props {
	article: Article;
	text: string;
}

export const Show: FunctionComponent<Props> = ({ article, text }) => {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { data: session, status } = useSession();
	let token = session?.user.tokens.token;

	const handleDelete = async () => {
		if (!article["@id"]) return;
		if (!window.confirm("Are you sure you want to delete this item?")) return;

		try {
			await fetch(article["@id"], { method: "DELETE" }, token);
			router.push("/articles");
		} catch (error) {
			setError("Error when deleting the resource.");
			console.error(error);
		}
	};

	return (
		<Template>
			<Container>
				<Head>
					<title>{`Show Article ${article["@id"]}`}</title>
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				</Head>
				{/* <Link
					href="/articles"
					className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
				>
					{"< Back to list"}
				</Link> */}
				<h3>{`Article ${article["designation"]}`}</h3>

				<Stack spacing={2} direction="row">
					<div style={{width: '100%'}}>
						<Box 
							sx={{
								display: 'flex',
								'& > :not(style)': { m: 1 },
								// alignItems: 'flex-end',
								justifyContent: 'flex-end'
							}}
						>
							<Fab 
								href={getItemPath(article["@id"], "/articles/[id]/edit")}
								size="small"
								color="secondary" aria-label="edit"
							>
								<EditIcon />
							</Fab>
							<Fab 
								onClick={handleDelete}
								size="small"
								color="error" aria-label="delete" 
							>
								<DeleteIcon/>
							</Fab>
						</Box>
					</div>
					{/* <Link href={getItemPath(article["@id"], "/articles/[id]/edit")}
						sx={{
							textDecoration: 'none'
						}}
					>
						Edit <EditIcon />
					</Link>
					<Link component="button"
						variant="body2"
						onClick={handleDelete}
						sx={{
							textDecoration: 'none'
						}}
					>
						Delete <DeleteIcon />
					</Link> */}
				</Stack>

				<TableContainer component={Paper}>
					<Table cellPadding={10} >
						<TableHead>
							<TableRow>
								<TableCell>Field</TableCell>
								<TableCell>Value</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>designation</TableCell>
								<TableCell>{article["designation"]}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>model</TableCell>
								<TableCell>{article["model"]}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>composition</TableCell>
								<TableCell>{article["composition"]}</TableCell>
							</TableRow>
							{/* <TableRow>
							<TableHead>manufacturingOrders</TableHead>
								<TableCell>
									<ReferenceLinks
									items={article["manufacturingOrders"].map((ref: any) => ({
										href: getItemPath(ref, "/manufacturingorders/[id]"),
										name: ref,
									}))}
									/>
								</TableCell>
							</TableRow> */}
						</TableBody>
					</Table>
				</TableContainer>

				{error && (
					<div>
						{error}
					</div>
				)}
			</Container>
		</Template>
	);
};
