import { FunctionComponent } from "react";

// import ReferenceLinks from "../common/ReferenceLinks";
import { getItemPath } from "../../utils/dataAccess";
import { Article } from "../../types/Article";
import { 
	Box, 
	Button, 
	Container, 
	Link, 
	Paper, 
	Table, 
	TableBody, 
	TableCell, 
	TableContainer, 
	TableHead, 
	TableRow, 
	styled, 
	tableCellClasses 
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface Props {
	articles: Article[];
}

export const List: FunctionComponent<Props> = ({ articles }) => (
	<Container component="span" >

		<Box  sx={{ display: 'flex', justifyContent: 'center' }} >
			<h1>Articles List</h1>
		</Box>

		<Box sx={{ m: 1, display: 'flex', justifyContent: 'flex-end' }} >
			<Link href="/articles/create" underline="none">
				<Button variant="contained" color="primary" endIcon={<AddIcon />}>
					Create
				</Button>
			</Link>
		</Box>

		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 700 }} aria-label="customized table" >
				<TableHead >
					<TableRow>
						{/* <StyledTableCell>id</StyledTableCell> */}
						<StyledTableCell align="left">designation</StyledTableCell>
						<StyledTableCell align="left">model</StyledTableCell>
						<StyledTableCell align="left">composition</StyledTableCell>
						{/* <StyledTableCell align="left">manufacturingOrders</StyledTableCell> */}
						<StyledTableCell colSpan={2} />
					</TableRow>
				</TableHead>
				<TableBody className="text-sm divide-y divide-gray-200">
					{articles &&
						articles.length !== 0 &&
						articles.map(
						(article) =>
							article["@id"] && (
							<StyledTableRow className="py-2" key={article["@id"]}>
								{/* <th scope="row">
								<ReferenceLinks
									items={{
									href: getItemPath(article["@id"], "/articles/[id]"),
									name: article["@id"],
									}}
								/> */}
								<StyledTableCell>{article["designation"]}</StyledTableCell>
								<StyledTableCell>{article["model"]}</StyledTableCell>
								<StyledTableCell>{article["composition"]}</StyledTableCell>
								{/* <StyledTableCell>
									<ReferenceLinks
										items={article["manufacturingOrders"].map((ref: any) => ({
											href: getItemPath(ref, "/manufacturingorders/[id]"),
											name: ref,
										}))}
									/>
								</StyledTableCell> */}
								<StyledTableCell className="w-8">
									<Link
										href={getItemPath(article["@id"], "/articles/[id]")}
										className="text-cyan-500"
									>
										Show
										
									</Link>
								</StyledTableCell>
								<StyledTableCell className="w-8">
									<Link
										href={getItemPath(article["@id"], "/articles/[id]/edit")}
										className="text-cyan-500"
									>
										Edit
										
									</Link>
								</StyledTableCell>
							</StyledTableRow>
							)
						)
					}
				</TableBody>
			</Table>
		</TableContainer>

	</Container>
);


const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));