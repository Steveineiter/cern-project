import requests

CERN_LLM_URL = "http://lbllmb.cern.ch:8000/v1/chat/completions"


def query_cern_llama3(title, abstract, criteria):
    headers = {"Content-Type": "application/json"}
    include_criteria_string, exclude_criteria_string = build_criteria_string(criteria)
    messages = build_messages(
        title, abstract, include_criteria_string, exclude_criteria_string
    )
    query = {"model": "/models/Meta-Llama-3.1-8B-Instruct", "messages": messages}

    response = requests.post(CERN_LLM_URL, headers=headers, json=query).json()
    neutrino_review_llm_tag = response.get("choices")[0].get("message").get("content")
    tokens_used_by_llm = response.get("usage").get("total_tokens")
    print("LLM Response: ", neutrino_review_llm_tag, tokens_used_by_llm)

    return neutrino_review_llm_tag, tokens_used_by_llm


def build_messages(title, abstract, include_criteria_string, exclude_criteria_string):
    pre_instruction = """
        Instructions: You are a researcher rigorously screening titles and abstracts of scientific papers for inclusion or exclusion in a review paper. Based on the provided inclusion and exclusion criteria listed below, you are asked to assign the paper to one of the following groups:
    
        “1 Highly Relevant”: Based on the given title and abstract, the paper meets all inclusion criteria and no exclusion criteria. Therefore, the paper will be included.
                    
        “2 Probably Relevant”: The information provided in the title and abstract indicates that the paper is likely relevant.
                    
        “3 Undecidable”: The given title and abstract do not contain enough information to evaluate whether the inclusion and exclusion criteria are met.
                    
        “4 Probably Irrelevant”: Based on the given title and abstract, it is likely that at least one inclusion criterion is not met or that at least one of the exclusion criteria is met.
                    
        “5 Not Relevant”: Based on the title and abstract, it is clear that the paper does not meet the criteria. Therefore, the paper will be excluded.
                    
        Based on the probability of a paper meeting all inclusion criteria and no exclusion criteria, assign it to one of the five categories. Only type the number of the group as “1”, “2”, “3”, “4” or “5” in your response. Do not type anything else.
    """

    features = f"Title: {title}\nAbstract: {abstract}\nInclusion Criteria:\n{include_criteria_string}\n\nExclusion Criteria:{exclude_criteria_string}"

    messages = [
        {"role": "system", "content": pre_instruction},
        {"role": "user", "content": features},
    ]
    return messages


def build_criteria_string(criteria):
    include_criteria_string = ""
    exclude_criteria_string = ""
    include_counter = 0
    exclude_counter = 0

    for single_criteria in criteria:
        if single_criteria.inclusion_criteria:
            include_counter += 1
            include_criteria_string += (
                f"\t{include_counter}. {single_criteria.inclusion_criteria}\n"
            )
        if single_criteria.exclusion_criteria:
            exclude_counter += 1
            exclude_criteria_string += (
                f"\t{include_counter}. {single_criteria.exclusion_criteria}\n"
            )

    return (include_criteria_string or f"\tno Include criteria"), (
        exclude_criteria_string or f"\tno Exclude criteria"
    )
