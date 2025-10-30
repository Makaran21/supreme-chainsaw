import { Node, mergeAttributes } from '@tiptap/core';

export interface SectionTitleOptions {
	HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		sectionTitle: {
			insertSectionTitle: () => ReturnType;
		};
	}
}

export const SectionTitle = Node.create<SectionTitleOptions>({
	name: 'sectionTitle',
	group: 'block',
	content: 'inline*',
	atom: false,
	
	addOptions() {
		return {
			HTMLAttributes: {}
		};
	},

	addAttributes() {
		return {
			text: {
				default: '២.៣ វិធីសាស្ត្រដែលយើងបានប្រើប្រាស់',
				parseHTML: (element) => element.querySelector('.title-text')?.textContent,
				renderHTML: (attributes) => {
					return {
						'data-text': attributes.text
					};
				}
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: 'div.section-title-wrapper'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		// Define reusable Tailwind class strings for clarity
		const DECORATION_CIRCLE_CLASSES = 'absolute size-4 rounded-full bg-teal-300';
		const DECORATION_BAR_CLASSES = 'flex-grow h-1 bg-sky-400 rounded-full';
		const DOT_CLASSES = 'size-4 rounded-full bg-sky-400';
	
		return [
			// Outer Container: Replaces 'section-title-wrapper'
			'div',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: 'space-y-4 w-full  mx-auto' // Ensures spacing and max width
			}),
			[
				// Inner Container: Replaces 'section-title-container'
				'div',
				{ class: 'p-2' }, // No padding needed here since children handle spacing
				
				// Top Decoration Line
				[
					'div',
					{ class: 'relative flex items-center h-4' }, // Replaces 'decoration-line top'
					
					// Left Circle
					['div', { class: `absolute -left-2 ${DECORATION_CIRCLE_CLASSES}` }],
					
					// Horizontal Bar
					['div', { class: DECORATION_BAR_CLASSES }]
				],
				
				// Title Row
				[
					'div',
					{ class: 'flex items-center justify-between text-2xl font-bold' }, // Replaces 'title-row'
					
					// Title Text (Editable Content - 'p' tag is inferred or forced)
					// The '0' tells Tiptap to render the node's content here.
					['p', { class: 'text-gray-800 text-lg' }, 0], 
					
					// Right Dots
					[
						'div',
						{ class: 'flex gap-0' }, // Replaces 'title-dots'
						['div', { class: DOT_CLASSES }],
						['div', { class: DOT_CLASSES }]
					]
				],
				
				// Bottom Decoration Line
				[
					'div',
					{ class: 'relative flex items-center h-4' }, // Replaces 'decoration-line bottom'
					
					// Left Circle
					['div', { class: `absolute -left-2 ${DECORATION_CIRCLE_CLASSES}` }],
					
					// Horizontal Bar
					['div', { class: DECORATION_BAR_CLASSES }]
				]
			]
		];
	},
	addCommands() {
		return {
			insertSectionTitle:
				() =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						content: [
							{
								type: 'text',
								text: 'Title'
							}
						]
					});
				}
		};
	}
});