import { date } from 'typesafe-i18n/formatters'
import type { FormattersInitializer } from 'typesafe-i18n'
import type { Locales, Formatters } from './i18n-types'

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) => {
	const a = Intl.DateTimeFormat(locale)

	const formatters: Formatters = {
		// add your formatter functions here
		dateFormatter: (strDate: string): string => a.format(new Date(strDate)),
	}

	return formatters
}
