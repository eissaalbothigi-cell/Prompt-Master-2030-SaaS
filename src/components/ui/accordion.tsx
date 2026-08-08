import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Page() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>ما هي منصة Prompt Master؟</AccordionTrigger>
        <AccordionContent>
          منصة متخصصة في هندسة البرومبتات وبناء تطبيقات الذكاء الاصطناعي.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}