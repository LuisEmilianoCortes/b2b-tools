
/**
 * Base information for a time zone associated with a country or region.
 * Intended for catalogs, dropdowns, and Intl-based formatting.
 */
export interface TimeZoneInfo {
  /**
   * Official IANA time zone identifier.
   * Used by Intl.DateTimeFormat and backend time handling.
   * Example: 'America/Mexico_City', 'Europe/Madrid'.
   */
  timeZone: string;

  /**
   * Country or region name.
   * Intended for user-friendly display in UI components.
   * Example: 'Mexico', 'United States (Eastern)'.
   */
  name: string;

  /**
   * ISO 4217 currency code used in the country or region.
   * Required for monetary formatting with Intl.NumberFormat.
   * Example: 'MXN', 'USD', 'EUR'.
   */
  currency: string;

  /**
   * Locale identifier following the BCP-47 standard.
   * Determines language, number formatting, and date conventions.
   * Example: 'es-MX', 'en-US', 'fr-FR'.
   */
  locale: string;

  /**
   * UTC offset of the time zone expressed in hours.
   * This value represents the standard offset and does not account for DST.
   * Example: -6, -5, +1, +5.5.
   */
  utcOffset: number;

  /**
   * City name.
   * Used as a human-readable label in dropdowns or selectors.
   * Example: 'Mexico City', 'New York', 'London'.
   */
  city: string;
}

export const TIME_ZONES = {
  // AFRICA
  CAIRO: { city: 'Cairo', timeZone: 'Africa/Cairo', name: 'Egypt', currency: 'EGP', locale: 'ar-EG', utcOffset: +2 },
  CASABLANCA: { city: 'Casablanca', timeZone: 'Africa/Casablanca', name: 'Morocco', currency: 'MAD', locale: 'ar-MA', utcOffset: 0 },
  JOHANNESBURG: { city: 'Johannesburg', timeZone: 'Africa/Johannesburg', name: 'South Africa', currency: 'ZAR', locale: 'en-ZA', utcOffset: +2 },

  // AMERICA
  BUENOS_AIRES: { city: 'Buenos Aires', timeZone: 'America/Argentina/Buenos_Aires', name: 'Argentina', currency: 'ARS', locale: 'es-AR', utcOffset: -3 },
  SAO_PAULO: { city: 'Sao Paulo', timeZone: 'America/Sao_Paulo', name: 'Brazil', currency: 'BRL', locale: 'pt-BR', utcOffset: -3 },
  TORONTO: { city: 'Toronto', timeZone: 'America/Toronto', name: 'Canada', currency: 'CAD', locale: 'en-CA', utcOffset: -5 },
  VANCOUVER: { city: 'Vancouver', timeZone: 'America/Vancouver', name: 'Canada (Pacific)', currency: 'CAD', locale: 'en-CA', utcOffset: -8 },
  BOGOTA: { city: 'Bogota', timeZone: 'America/Bogota', name: 'Colombia', currency: 'COP', locale: 'es-CO', utcOffset: -5 },
  CANCUN: { city: 'Cancun', timeZone: 'America/Cancun', name: 'Mexico (Quintana Roo)', currency: 'MXN', locale: 'es-MX', utcOffset: -5 },
  MEXICO_CITY: { city: 'Mexico City', timeZone: 'America/Mexico_City', name: 'Mexico', currency: 'MXN', locale: 'es-MX', utcOffset: -6 },
  TIJUANA: { city: 'Tijuana', timeZone: 'America/Tijuana', name: 'Mexico (Pacific)', currency: 'MXN', locale: 'es-MX', utcOffset: -8 },
  LIMA: { city: 'Lima', timeZone: 'America/Lima', name: 'Peru', currency: 'PEN', locale: 'es-PE', utcOffset: -5 },
  SANTIAGO: { city: 'Santiago', timeZone: 'America/Santiago', name: 'Chile', currency: 'CLP', locale: 'es-CL', utcOffset: -4 },
  CHICAGO: { city: 'Chicago', timeZone: 'America/Chicago', name: 'United States (Central)', currency: 'USD', locale: 'en-US', utcOffset: -6 },
  DENVER: { city: 'Denver', timeZone: 'America/Denver', name: 'United States (Mountain)', currency: 'USD', locale: 'en-US', utcOffset: -7 },
  LOS_ANGELES: { city: 'Los Angeles', timeZone: 'America/Los_Angeles', name: 'United States (Pacific)', currency: 'USD', locale: 'en-US', utcOffset: -8 },
  NEW_YORK: { city: 'New York', timeZone: 'America/New_York', name: 'United States (Eastern)', currency: 'USD', locale: 'en-US', utcOffset: -5 },

  // ASIA
  SHANGHAI: { city: 'Shanghai', timeZone: 'Asia/Shanghai', name: 'China', currency: 'CNY', locale: 'zh-CN', utcOffset: +8 },
  KOLKATA: { city: 'Kolkata', timeZone: 'Asia/Kolkata', name: 'India', currency: 'INR', locale: 'en-IN', utcOffset: +5.5 },
  TOKYO: { city: 'Tokyo', timeZone: 'Asia/Tokyo', name: 'Japan', currency: 'JPY', locale: 'ja-JP', utcOffset: +9 },
  SEOUL: { city: 'Seoul', timeZone: 'Asia/Seoul', name: 'South Korea', currency: 'KRW', locale: 'ko-KR', utcOffset: +9 },
  DUBAI: { city: 'Dubai', timeZone: 'Asia/Dubai', name: 'United Arab Emirates', currency: 'AED', locale: 'ar-AE', utcOffset: +4 },

  // EUROPE
  BERLIN: { city: 'Berlin', timeZone: 'Europe/Berlin', name: 'Germany', currency: 'EUR', locale: 'de-DE', utcOffset: +1 },
  PARIS: { city: 'Paris', timeZone: 'Europe/Paris', name: 'France', currency: 'EUR', locale: 'fr-FR', utcOffset: +1 },
  ROME: { city: 'Rome', timeZone: 'Europe/Rome', name: 'Italy', currency: 'EUR', locale: 'it-IT', utcOffset: +1 },
  MADRID: { city: 'Madrid', timeZone: 'Europe/Madrid', name: 'Spain', currency: 'EUR', locale: 'es-ES', utcOffset: +1 },
  ZURICH: { city: 'Zurich', timeZone: 'Europe/Zurich', name: 'Switzerland', currency: 'CHF', locale: 'de-CH', utcOffset: +1 },
  LONDON: { city: 'London', timeZone: 'Europe/London', name: 'United Kingdom', currency: 'GBP', locale: 'en-GB', utcOffset: 0 },

  // OCEANIA
  SYDNEY: { city: 'Sydney', timeZone: 'Australia/Sydney', name: 'Australia', currency: 'AUD', locale: 'en-AU', utcOffset: +10 },
  AUCKLAND: { city: 'Auckland', timeZone: 'Pacific/Auckland', name: 'New Zealand', currency: 'NZD', locale: 'en-NZ', utcOffset: +12 },
};

