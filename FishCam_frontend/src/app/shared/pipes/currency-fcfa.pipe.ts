import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFcfa',
  standalone: true
})
export class CurrencyFcfaPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '0 FCFA';
    
    const isNegative = value < 0;
    const absoluteValue = Math.abs(value);
    
    // Force le formatage avec des espaces
    const formattedNumber = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(absoluteValue).replace(/,/g, ' '); // Remplace les virgules par des espaces au cas où

    return `${isNegative ? '- ' : ''}${formattedNumber} FCFA`;
  }
}