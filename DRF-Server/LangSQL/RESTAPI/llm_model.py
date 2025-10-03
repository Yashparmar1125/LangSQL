"""LLM wrapper with optional ML dependencies.

This module defers importing heavy ML libraries so the DRF server can
boot without transformers/torch installed. If they are missing at runtime,
an informative error will be raised when generation is requested.
"""

# Lazy-loaded globals
_tokenizer = None
_model = None
_device = None

def _ensure_model_loaded():
    global _tokenizer, _model, _device
    if _tokenizer is None or _model is None or _device is None:
        try:
            from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
            import torch
        except Exception as exc:
            raise RuntimeError(
                "ML dependencies are not installed. Install requirements-ml.txt to enable text-to-SQL."
            ) from exc

        _tokenizer = AutoTokenizer.from_pretrained("gaussalgo/T5-LM-Large-text2sql-spider")
        _model = AutoModelForSeq2SeqLM.from_pretrained("gaussalgo/T5-LM-Large-text2sql-spider")
        _device = "cuda" if torch.cuda.is_available() else "cpu"
        _model.to(_device)

# Format input for LLM
def format_input(question, schema):
    """
    Formats the question and schema into a prompt for the model.
    Ensures primary keys and foreign keys are preserved.
    """
    return f"Question: {question} Schema: {schema}"

# Generate SQL query
def text_to_sql(question, schema):
    """
    Generates SQL query from natural language question and schema.
    """
    _ensure_model_loaded()
    input_text = format_input(question, schema)

    inputs = _tokenizer(
        input_text,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=512,
    ).to(_device)

    # Import torch locally to avoid module-level dependency
    import torch
    with torch.no_grad():  # Disable gradients for inference
        outputs = _model.generate(
            **inputs,
            max_length=256,
            num_beams=5,
            early_stopping=True,
        )

    sql_query = _tokenizer.decode(
        outputs[0],
        skip_special_tokens=True,
        clean_up_tokenization_spaces=False,
    )
    return sql_query