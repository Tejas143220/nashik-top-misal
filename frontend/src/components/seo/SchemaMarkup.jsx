import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SchemaMarkup = ({ schemaData }) => {
  if (!schemaData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;
