import { format } from 'date-fns'

export const dateFormatter = (timestamp: number): string => format(new Date(timestamp), 'MM-dd hh:mm aaaaa\'m\'')
