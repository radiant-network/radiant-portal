import type { Meta, StoryObj } from '@storybook/react';

import { Command, Command as CommandPrimitive } from 'cmdk';
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandItemCheckbox, CommandList, CommandSeparator } from '@/components/base/ui/command';

const meta = {
	title: 'Data Entry/Command',
	args: {
	},
	component: CommandPrimitive,
} satisfies Meta<typeof CommandPrimitive>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {

		return (
			<Command className="rounded-lg border shadow-md md:min-w-[450px]">
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup>
						<CommandItem>
							<span>CommandItem</span>
						</CommandItem>
						<CommandItem disabled>
							<span>CommandItem:Disabled</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup>
						<CommandItemCheckbox>
							<span>CommandItemCheckbox</span>
						</CommandItemCheckbox>
						<CommandItemCheckbox disabled>
							<span>CommandItemCheckbox:disabled</span>
						</CommandItemCheckbox>
					</CommandGroup>
				</CommandList>
			</Command>
		)
	},
};

