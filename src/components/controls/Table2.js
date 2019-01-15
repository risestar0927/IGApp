import React, { createContext } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import ReactTable, { ReactTableDefaults } from 'react-table'
import { withFixedColumnsStickyPosition } from 'react-table-hoc-fixed-columns'
import Component from 'components/Component'
import style from 'styles/controls/table2.css'
import reactTableStyle from 'react-table/react-table.css'

const ReactTableFixedColumns = withFixedColumnsStickyPosition(ReactTable)

const tableStyles = style.locals
const IsFooterRowContext = createContext(false)

const TheadComponent = ({ children, className, headerClassName, ...props }) => (
	<ReactTableDefaults.TheadComponent {...props} className={classnames(className, headerClassName)}>
		{children}
	</ReactTableDefaults.TheadComponent>
)

const TheadWithFooterRowComponent = ({
	children,
	className,
	headerClassName,
	headRowClassName,
	footRowClassName,
	...props
}) => (
	<ReactTableDefaults.TheadComponent {...props} className={classnames(className, headerClassName)}>
		<div className={classnames(tableStyles.headRow, headRowClassName)}>
			<IsFooterRowContext.Provider value={false}>
				{children}
			</IsFooterRowContext.Provider>
		</div>
		<div className={classnames(tableStyles.footRow, footRowClassName)}>
			<IsFooterRowContext.Provider value={true}>
				{children}
			</IsFooterRowContext.Provider>
		</div>
	</ReactTableDefaults.TheadComponent>
)

const ThComponent = ({ children, cellClassName, ...props }) => (
	<ReactTableDefaults.ThComponent {...props}>
		<div className={classnames(tableStyles.cellContent, cellClassName)}>{children}</div>
	</ReactTableDefaults.ThComponent>
)

const ThWithFooterCheckComponent = ({ children, cellClassName, footer, ...props }) => (
	<ReactTableDefaults.ThComponent {...props}>
		<IsFooterRowContext.Consumer>
			{(isFooter) => isFooter
			? (
				<div className={classnames(tableStyles.cellContent, cellClassName)}>{footer}</div>
			)
			: (
				<div className={classnames(tableStyles.cellContent, cellClassName)}>{children}</div>
			)}
		</IsFooterRowContext.Consumer>
	</ReactTableDefaults.ThComponent>
)

const TdComponent = ({ children, cellClassName, ...props }) => (
	<ReactTableDefaults.TdComponent {...props}>
		<div className={classnames(tableStyles.cellContent, cellClassName)}>{children}</div>
	</ReactTableDefaults.TdComponent>
)

export default class Table extends Component {
	style = style;

	styles = [style, reactTableStyle];

	static propTypes = {
		// wrapper classname
		className: PropTypes.string,
		// table classname
		tableClassName: PropTypes.string,
		headerClassname: PropTypes.string,
		headRowClassName: PropTypes.string,
		rowClassName: PropTypes.string,
		footRowClassName: PropTypes.string,
		// use together with one of headRowClassName, rowClassName or footRowClassName to override specific cell
		cellClassName: PropTypes.string,

		columns: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string.isRequired,
			header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
			// (value, rowData) => PropTypes.node,
			cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
			footer: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
			divider: PropTypes.bool,
			fixed: PropTypes.oneOf(['left', 'right']),
			sortable: PropTypes.bool,
			minWidth: PropTypes.number,
			className: PropTypes.string,
			headerClassName: PropTypes.string,
			footerClassName: PropTypes.string,
		})),
		data: PropTypes.arrayOf(PropTypes.object),
		defaultMinWidth: PropTypes.number, // default min width of column
		showFootRowOnHeader: PropTypes.bool,
	}

	static defaultProps = {
		defaultMinWidth: 120,
	}

	makeColumns() {
		const { columns, defaultMinWidth } = this.props

		return columns.map(({
			id,
			header,
			cell,
			footer,
			accessor = (item) => item,
			divider,
			sortable = false,
			minWidth = defaultMinWidth,
			className,
			headerClassName,
			footerClassName,
			...other
		}) => {


			return {
				id,
				accessor: typeof cell === 'string' ? cell : accessor,
				sortable,
				minWidth,
				Cell: typeof cell === 'function' ? (row) => cell(row.value, row) : cell,
				Header: header,
				Footer: footer,
				getHeaderProps: () => ({ footer }),
				className: classnames(className, divider && tableStyles.divider),
				headerClassName: classnames(headerClassName, divider && tableStyles.divider),
				footerClassName: classnames(footerClassName, divider && tableStyles.divider),
				...other
			}
		})
	}

	render() {
		const {
			className,
			tableClassName,
			headerClassName,
			headRowClassName,
			rowClassName,
			footRowClassName,
			cellClassName,
			data,
			columns,
			defaultMinWidth,
			showFootRowOnHeader,
			noPadding,
			...other
		} = this.props
		const tableData = data || []

		return (
			<div className={classnames(tableStyles.wrap, noPadding && tableStyles.noPadding, className)}>
				<ReactTableFixedColumns
					ThComponent={showFootRowOnHeader ? ThWithFooterCheckComponent : ThComponent}
					TdComponent={TdComponent}
					TheadComponent={showFootRowOnHeader ? TheadWithFooterRowComponent : TheadComponent}
					NoDataComponent={() => null} // turn it off for now
					showPagination={false}
					pageSize={tableData.length}
					resizable={true}
					className={classnames(tableStyles.table, tableClassName)}
					data={tableData}
					columns={this.makeColumns()}
					getTheadGroupTrProps={() => ({ className: classnames(tableStyles.headRow, headRowClassName) })}
					getTheadGroupThProps={() => ({
						className: tableStyles.cell,
						cellClassName,
					})}
					getTheadProps={() => (showFootRowOnHeader ? {
						headerClassName,
						headRowClassName,
						footRowClassName,
					} : {
						headerClassName,
					})}
					getTheadTrProps={() => ({
						className: classnames(tableStyles.headRow, headRowClassName),
					})}
					getTheadThProps={() => ({
						className: tableStyles.cell,
						cellClassName,
					})}
					getTrProps={() => ({ className: classnames(tableStyles.tableRow, rowClassName) })}
					getTrGroupProps={() => ({ className: tableStyles.tableRowGroup })}
					getTdProps={() => ({
						className: tableStyles.cell,
						cellClassName,
					})}
					getTfootProps={() => ({ className: tableStyles.foot })}
					getTfootTrProps={() => ({ className: classnames(tableStyles.footRow, footRowClassName) })}
					getTfootTdProps={() => ({
						className: tableStyles.cell,
						cellClassName,
					})}
					{...other}
				/>
			</div>
		)
	}
}

export const SmallTable = ({ headRowClassName, rowClassName, cellClassName, ...props }) => (
	<Table
		headerClassName={tableStyles.smallHeader}
		headRowClassName={classnames(tableStyles.smallHeadRow, headRowClassName)}
		rowClassName={classnames(tableStyles.smallRow, rowClassName)}
		cellClassName={classnames(tableStyles.smallCell, cellClassName)}
		defaultMinWidth={60}
		{...props}
	/>
)