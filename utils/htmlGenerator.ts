import React from 'react';
import type { EmailResult, EmailSection } from '../types';

function findSection(sections: EmailSection[], name: string): EmailSection | undefined {
    return sections.find(s => s.name.startsWith(name));
}

function styleObjectToString(style: React.CSSProperties): string {
    if (!style) return '';
    return Object.entries(style)
        .map(([key, value]) => {
            if (value === undefined || value === null || value === '') return '';
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value};`;
        })
        .join(' ');
}


export function generateHtmlFromEmailResult(result: EmailResult, dir: 'rtl' | 'ltr' = 'ltr', customStyles: {[key: string]: React.CSSProperties} = {}): string {
    const preheader = findSection(result.sections, 'Preheader')?.content || '';
    const subject = findSection(result.sections, 'Subject Line')?.content || 'Your Email Subject';
    const headerDesc = findSection(result.sections, 'Header Image')?.content || '';
    const openingLine = findSection(result.sections, 'Opening Line')?.content || '';
    const bodyCopy = findSection(result.sections, 'Body Copy')?.content || '';
    const socialProof = findSection(result.sections, 'Social Proof')?.content || '';
    const primaryCta = findSection(result.sections, 'Call-to-Action')?.content || '';
    const secondaryCta = findSection(result.sections, 'Secondary CTA')?.content || '';
    const signature = findSection(result.sections, 'Signature Block')?.content || '';
    const footer = findSection(result.sections, 'Footer')?.content || '';

    const globalStyles = customStyles['Global Styles'] || {};

    const mergeStyles = (...styleObjects: (React.CSSProperties | undefined)[]) => {
        return styleObjects.reduce((acc, current) => ({ ...acc, ...current }), {});
    };

    // Define default styles
    const defaultStyles: { [key: string]: React.CSSProperties } = {
        body: { fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`, margin: '0', padding: '0', backgroundColor: '#f4f4f4', direction: dir, color: '#333333' },
        main: { padding: '20px', borderRadius: '8px', backgroundColor: '#ffffff' },
        p: { margin: '0 0 16px 0', lineHeight: 1.6, fontSize: '16px' },
        button: { display: 'inline-block', backgroundColor: '#34495e', color: '#ffffff', textDecoration: 'none', padding: '12px 24px', borderRadius: '5px', fontWeight: 'bold' },
        secondaryLink: { color: '#34495e', textDecoration: 'underline' },
        footer: { backgroundColor: '#f4f4f4', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#777777' },
        preheader: { display: 'none !important', visibility: 'hidden', opacity: 0, color: 'transparent', height: 0, width: 0 },
        header: { paddingBottom: '20px', textAlign: 'center', fontStyle: 'italic', color: '#888', borderBottom: '1px solid #eeeeee', marginBottom: '20px' },
        socialProof: { fontStyle: 'italic', borderLeft: '3px solid #ccc', paddingLeft: '15px', marginBottom: '16px' },
        wrapper: { width: '100%', tableLayout: 'fixed' },
        outerTable: { margin: '0 auto', width: '100%', maxWidth: '600px', borderSpacing: '0' },
    };

    const finalStyles: { [key: string]: React.CSSProperties } = {};
    
    // Merge styles with correct precedence: Default < Global < Section-specific
    finalStyles.body = mergeStyles(defaultStyles.body, globalStyles);
    finalStyles.main = mergeStyles(defaultStyles.main, { backgroundColor: finalStyles.body.backgroundColor }, globalStyles, customStyles['Global Styles']);
    finalStyles.p = mergeStyles(defaultStyles.p, globalStyles, customStyles['Body Copy']);
    finalStyles.openingLine = mergeStyles(defaultStyles.p, globalStyles, customStyles['Opening Line']);
    finalStyles.signature = mergeStyles(defaultStyles.p, globalStyles, customStyles['Signature Block']);
    finalStyles.button = mergeStyles(defaultStyles.button, globalStyles, customStyles['Call-to-Action']);
    finalStyles.secondaryLink = mergeStyles(defaultStyles.secondaryLink, globalStyles, customStyles['Secondary CTA']);
    finalStyles.footer = mergeStyles(defaultStyles.footer, globalStyles, customStyles['Footer']);
    finalStyles.header = mergeStyles(defaultStyles.header, globalStyles, customStyles['Header Image or Clean Hero Section']);
    finalStyles.socialProof = mergeStyles(defaultStyles.socialProof, globalStyles, customStyles['Social Proof / Micro-Story / Case Snippet']);

    // Non-stylable, structural styles
    finalStyles.preheader = defaultStyles.preheader;
    
    // Convert all style objects to strings for inline use
    const styleStrings = Object.fromEntries(
        Object.entries(finalStyles).map(([key, value]) => [key, styleObjectToString(value)])
    );
    
    // Special cases for email client compatibility
    const wrapperStyle = `width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;`;
    const outerTableStyle = `margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; font-family: ${finalStyles.body.fontFamily || 'sans-serif'};`;

    return `
<!DOCTYPE html>
<html lang="${dir === 'rtl' ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="${styleStrings.body}">
  <span style="${styleStrings.preheader}">${preheader}</span>
  <div style="${wrapperStyle}">
    <table width="100%" style="${outerTableStyle}">
      <tr>
        <td style="padding: 20px;">
          <table width="100%" style="border-spacing: 0;">
            <tr>
              <td style="${styleStrings.main}">
                ${headerDesc ? `<div style="${styleStrings.header}">${headerDesc}</div>` : ''}
                
                <p style="${styleStrings.openingLine}">${openingLine.replace(/\n/g, '<br>')}</p>
                
                <p style="${styleStrings.p}">${bodyCopy.replace(/\n/g, '<br>')}</p>
                
                ${socialProof ? `<p style="${styleStrings.socialProof}">${socialProof.replace(/\n/g, '<br>')}</p>` : ''}
                
                ${primaryCta ? `<p style="text-align: center; margin: 24px 0;"><a href="#" style="${styleStrings.button}">${primaryCta}</a></p>` : ''}
                
                ${secondaryCta ? `<p style="text-align: center; margin: 24px 0;"><a href="#" style="${styleStrings.secondaryLink}">${secondaryCta}</a></p>` : ''}

                <div style="${styleStrings.signature}">${signature.replace(/\n/g, '<br>')}</div>
              </td>
            </tr>
            <tr>
              <td style="${styleStrings.footer}">
                ${footer.replace(/\n/g, '<br>')}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}