// @ts-nocheck
const { isHTML, isMarkdown, processedContent } = useMemo(() => {
	const contentIsHTML = isHTMLContent(content)
	if (contentIsHTML) {
		return {
			isHTML: true,
			isMarkdown: false,
			processedContent: DOMPurify.sanitize(content),
		}
	}
	let processed = content
	if (content.includes('\n$ ')) {
		processed = content.replace(/^\$ (.*$)/gm, '```bash\n$ $1\n```')
	}
	if (
		content.trim().startsWith('{') &&
		content.includes('`') &&
		content.includes(':')
	) {
		const lines = content.split('\n')
		let inJsonBlock = false
		const jsonLines: string[] = []
		const otherLines: string[] = []
		for (const line of lines) {
			if (line.trim() === '{' || line.trim() === '[') {
				inJsonBlock = true
			}
			if (inJsonBlock) {
				jsonLines.push(line)
				if (line.trim() === '}' || line.trim() === ']') {
					inJsonBlock = false
				}
			} else {
				otherLines.push(line)
			}
		}
		if (jsonLines.length > 0 && jsonLines.join('\n').trim()) {
			const jsonBlock = jsonLines.join('\n')
			const otherContent = otherLines.join('\n')
			processed =
				otherContent +
				(otherContent ? '\n\n' : '') +
				'```json\n' +
				jsonBlock +
				'\n```'
		}
	}
	return {
		isHTML: false,
		isMarkdown: true,
		processedContent: processed,
	}
}, [content])