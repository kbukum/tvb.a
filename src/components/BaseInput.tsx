import React from 'react'
import { View, Header, Text } from 'native-base'

import Style from './BaseInputStyle'
import Component from './Component'

export enum QuestionType {
	Textfield, Slider, Checkbox, RadioButton, Dropdown,
}

export interface BaseProps {
	tag: string
	required?: boolean
	title?: string
	trackType?: string
	smartCode?: string
	startDate?: number
	endDate?: number
	oneTime?: boolean
	newLine?: boolean
	visible?: boolean
	visibleIf?: string
	defaultValue?: string | string[]
}

export interface BaseState {
	display?: boolean
}

export abstract class BaseInput<P extends BaseProps, S extends BaseState> extends Component<P, S>  {

	protected ruleExecutors: (() => void)[]

	constructor(props: P) {
		super(props)
		this.ruleExecutors = []
		this.setValue = this.setValue.bind(this)
	}

	public abstract getValue(): any | undefined

	public abstract setValue(value: any): void

	public componentWillMount() {
		if (this.props.tag === undefined || this.props.tag === '') {
			throw new Error(`${this.constructor.name} has no proper tag.`)
		}
	}

	public componentDidUpdate() {
		this.executeRuleListeners()
	}

	public render(...components: any[]): JSX.Element {
		if (this.state.display) {
			return (
				<View>
					{this.getTitle()}
					{components}
				</View>
			)
		}
		return <View />
	}

	public isValid(): boolean {
		const value = this.getValue()
		if (this.props.required && value === undefined) {
			return false
		}
		return true
	}

	public addRuleExecutor(ruleExecutor: () => void): void {
		this.ruleExecutors.push(ruleExecutor)
	}

	public show(): void {
		this.setState({ display: true })
	}

	public hide(): void {
		this.setState({ display: false })
	}

	protected getTitle(): JSX.Element | undefined {
		return (this.props.title === undefined ? undefined :
			<Header style={Style.header}>
				<Text style={Style.title}>{this.props.title}</Text>
			</Header>
		)
	}

	private executeRuleListeners(): void {
		this.ruleExecutors.map(ruleExecutor => ruleExecutor.call(null, this.getValue()))
	}

}
